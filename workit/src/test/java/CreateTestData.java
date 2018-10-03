import com.thedeanda.lorem.Lorem;
import com.thedeanda.lorem.LoremIpsum;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.DaoRegistry;
import com.vormadal.workit.database.models.*;
import com.vormadal.workit.database.mongo.MongoCaseDao;
import com.vormadal.workit.database.mongo.MongoClientDao;
import com.vormadal.workit.database.mongo.MongoProjectDao;
import com.vormadal.workit.database.mongo.MongoTimeRegistrationDao;

import java.util.*;

/**
 * Created: 05-09-2018
 * author: Runi
 */

public class CreateTestData {

    private Lorem loremIpsum = LoremIpsum.getInstance();

    public static void main(String[] args) throws MorphiaException {
        new CreateTestData().setupClients(10);
    }

    //10 ->         100 ->      100.000 ->      1.000.000
    //10 clients * 10 projects * 1000 cases * 10 timeregistrations
    public void setupClients(int num) throws MorphiaException {
        if (num <= 0) return;
        List<Client> clients = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Client client = Client.builder()
                    .name(loremIpsum.getWords(5, i))
                    .build();
            client.setId("TEST" + i);
            setupProjects(client, 10);
            clients.add(client);
        }
        new MongoClientDao(DaoRegistry.getInstance()).createMultiple(clients);
    }

    public void setupProjects(Client client, int num) throws MorphiaException {
        if (num <= 0) return;
        List<Project> projects = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Project project = Project.builder()
                    .clientId(client.getId())
                    .name(loremIpsum.getWords(5, 10))
                    .build();
            project.setId((client.getId() + "PROJ" + i));
            projects.add(project);
            setupCases(project.getId(), 1000);
        }
        new MongoProjectDao(DaoRegistry.getInstance()).createMultiple(projects);
    }

    public void setupCases(String projectId, int num) throws MorphiaException {
        if (num <= 0) return;
        Random r = new Random();
        List<Case> cases = new ArrayList<>();
        List<TimeRegistration> timeRegistrations = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Case aCase = Case.builder()
                    .title(loremIpsum.getWords(5, 10))
                    .description(loremIpsum.getWords(20, 60))
                    .estimate(i * 10)
                    .status(loremIpsum.getWords(1))
                    .projectId(projectId)
                    .build();
            aCase.setId(projectId + "-" + i);
            int numComments = r.nextInt(10);
            List<Comment> comments = new ArrayList<>();
            long now = new Date().getTime();
            long currentComment = now - r.nextInt(1000 * 60 * 60 * 24 * 24);

            for (int j = 0; j < numComments; j++) {
                comments.add(Comment.builder()
                        .created(new Date(currentComment))
                        .text(loremIpsum.getWords(5, 25))
                        .author(UserRef.builder().name(loremIpsum.getName()).build())
                        .build());
                currentComment += r.nextInt(Math.toIntExact(now - currentComment));
            }
            aCase.setComments(comments);
            cases.add(aCase);

            for(int j = 0; j < 10; j++){
                TimeRegistration tr = TimeRegistration.builder()
                        .caseId(aCase.getId())
                        .hours(r.nextInt(8))
                        .date(new Date(now-r.nextInt()))
                        .projectId(projectId)
                        .user(UUID.randomUUID().toString())
                        .build();
                timeRegistrations.add(tr);
            }
        }
        new MongoTimeRegistrationDao(DaoRegistry.getInstance()).createMultiple(timeRegistrations);
        new MongoCaseDao(DaoRegistry.getInstance()).createMultiple(cases);
    }
}
