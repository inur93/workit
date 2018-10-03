import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.DaoRegistry;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Role;

import java.util.*;

import static com.vormadal.workit.database.DaoRegistry.getRoleDao;
import static java.util.Arrays.asList;

/**
 * Created: 21-09-2018
 * author: Runi
 */

public class TestPolicies {

    public static void main(String[] args) throws MorphiaException {
        new TestPolicies().run();
    }

    private void run() throws MorphiaException {
        Policy p1 = createPolicy("role1",
                asList("clients",
                        "clients/{id}",
                        "clients/{id}/projects",
                        "clients/{id}/projects/{pid}"
                        ),
                asList("read"),
                null);
        Policy p2 = createPolicy("role2",
                asList("clients",
                        "clients/{id}",
                        "clients/{id}/projects",
                        "clients/{id}/projects/{pid}"
                        ),
                asList("update"),
                null);
        Map<String, String> params3 = new HashMap<>();
        params3.put("id", "cli3");
        Policy p3 = createPolicy("role2",
                asList("clients",
                        "clients/{id}",
                        "clients/{id}/projects",
                        "clients/{id}/projects/{pid}"
                        ),
                asList("update"),
                params3);
        DaoRegistry.getPolicyDao().createMultiple(asList(p1, p2, p3));

        List<Policy> access = DaoRegistry.getPolicyDao().getAccess(new HashSet<>(asList("role1", "role2")));

        getRoleDao().create(createRole("role1"));
        getRoleDao().create(createRole("role2"));
        System.out.println("test");
    }

    private Role createRole(String name){
        Role role = new Role();
        role.setName(name);
        return role;
    }

    private Policy createPolicy(String roleId,
                                List<String> resources,
                                List<String> permissions,
                                Map<String, String> params) {
        Policy p = new Policy();
        p.setRoleId(roleId);
        p.setPermissions(new HashSet<>(permissions));
        p.setResources(resources);
        p.setParams(params == null ? new HashMap<>() : params);
        return p;
    }
}
