package com.vormadal.workit.util;

import lombok.extern.slf4j.Slf4j;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;

import static com.vormadal.workit.config.Config.*;

@Slf4j
public class Mailer {
	private static Mailer mailer;

	private static final boolean isMailEnabled = SEND_MAIL;
	private Properties props;
	private String fromname = SYSTEM_MAIL_SENDER; //den adresse mail kommer fra
	private String username = MAIL_USER; //for logging into mailserver
	private String password = MAIL_PASSWORD;
	private String smtpServer = SMTP_SERVER;//"send.one.com";//"smtp.gmail.com")
	private String portnumber = SMTP_PORT;

	//Singleton constructor
	private Mailer(){		
		props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		if (smtpServer==null || "".equals(smtpServer) || portnumber == null || "".equals(portnumber)){
			log.error("SmtpServer/Port not set! Check DeployConfig");
		}
		props.put("mail.smtp.host", smtpServer);
		props.put("mail.smtp.port", portnumber);
	}

	//Get instance
	public static Mailer getInstance(){
		if (mailer ==null) mailer = new Mailer();
		return mailer;
	}

	public void sendTemplateMail(String recipient, String subject, String templateFileName, Map<String,Object> variables) throws IOException {
		String mail = FileLoader.loadMustache("/" + templateFileName, variables);
		sendMail(recipient,subject,mail);
	}

	public void sendMail(String recipient, String subject, String HTMLMessage ){
		//if(!recipient.matches("[\\w.-]+@[\\w.-]+")) {System.out.println("invalid mail: " + recipient);return;}
		//recipient = "toh@bibmed.dk";
		if(!isMailEnabled){
			System.out.println("Mail disabled. Mail to:"+recipient);
			System.out.println("Mailbody: "+HTMLMessage);
			return;
			};
		if (username==null || password==null){
			log.error("Username/Password for mailServer not set! Check DeployConfig");
			return;
		}
		Session session = Session.getInstance(props,
				new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		MimeMessage msg = new MimeMessage(session);
		String[] recipients = recipient.split(";");
		
		try {
			msg.setText(HTMLMessage, "utf-8", "html");
			msg.setFrom(fromname);
			for(String recip:recipients){ //hvis der er flere modtagere, tilføj
				msg.addRecipient(Message.RecipientType.TO, new InternetAddress(recip));
			}
			
			//			msg.addRecipient(Message.RecipientType.BCC, new InternetAddress("christian@budtz.eu"));
			msg.setSubject(subject, "utf-8");
			Transport.send(msg);
			

		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}

}
