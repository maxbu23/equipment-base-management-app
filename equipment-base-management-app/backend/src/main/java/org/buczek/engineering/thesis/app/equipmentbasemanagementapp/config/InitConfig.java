package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class InitConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.credentials.admin1.email}")
    private String admin1Email;

    @Value("${application.credentials.admin1.password}")
    private String admin1Password;

    @Override
    public void run(String... args) throws Exception {
        User admin = User.builder()
                .email(admin1Email)
                .firstname("Bob")
                .lastname("Marley")
                .password(passwordEncoder.encode(admin1Password))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }
}
