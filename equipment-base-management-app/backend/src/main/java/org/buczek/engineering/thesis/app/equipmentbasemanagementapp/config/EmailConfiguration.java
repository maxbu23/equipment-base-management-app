package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfiguration {

    @Bean
    public JavaMailSenderImpl mailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

        javaMailSender.setHost("smtp.gmail.com");
        javaMailSender.setPort(587);
        javaMailSender.setUsername("maxbutest@gmail.com");
        javaMailSender.setPassword("cdof yboe sksj hqdq");

        Properties javaEmailProperties = new Properties();
        javaEmailProperties.put("mail.smtp.ssl.trust", "*");
        javaEmailProperties.put("mail.smtp.auth", "true");
        javaEmailProperties.put("mail.smtp.starttls.enable", "true");
        javaEmailProperties.put("mail.smtp.connectiontimeout", "5000");
        javaEmailProperties.put("mail.smtp.timeout", "3000");
        javaEmailProperties.put("mail.smtp.writetimeout", "3000");
        javaMailSender.setJavaMailProperties(javaEmailProperties);

        return javaMailSender;
    }
}
