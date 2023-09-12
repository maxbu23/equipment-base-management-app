package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@AllArgsConstructor
public class InitConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) throws Exception {
        User admin = User.builder()
                .email("marley@gmail.com")
                .firstname("Bob")
                .lastname("Marley")
                .password(passwordEncoder.encode("password"))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }
}
