package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class InitConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final EquipmentRepository equipmentRepository;

    @Value("${application.credentials.admin1.email}")
    private String admin1Email;
    @Value("${application.credentials.admin1.password}")
    private String admin1Password;

    @Value("${application.credentials.user1.email}")
    private String user1Email;
    @Value("${application.credentials.user1.password}")
    private String user1Password;

    @Override
    public void run(String... args) throws Exception {
        User admin = User.builder()
                .email(admin1Email)
                .firstname("Bob")
                .lastname("Marley")
                .password(passwordEncoder.encode(admin1Password))
                .role(Role.ADMIN)
                .build();

        User user = User.builder()
                .email(user1Email)
                .firstname("Mariusz")
                .lastname("Kowal")
                .email(user1Email)
                .password(passwordEncoder.encode(user1Password))
                .role(Role.USER)
                .build();

        userRepository.save(admin);
        userRepository.save(user);
        saveInitEquipments();
    }

    private void saveInitEquipments() {
        Equipment equipment1 = Equipment.builder()
                .name("Mac Book Pro 13")
                .equipmentType(EquipmentType.PC)
                .owner(null)
                .serialNumber("ASD-1234-2345")
                .brand("Apple")
                .build();
        Equipment equipment2 = Equipment.builder()
                .name("Mac Book Air 14")
                .equipmentType(EquipmentType.PC)
                .owner(null)
                .serialNumber("ASD-8989-2345")
                .brand("Apple")
                .build();
        Equipment equipment3 = Equipment.builder()
                .name("Keyboard Logitech MX mini")
                .equipmentType(EquipmentType.PRINTER)
                .owner(null)
                .serialNumber("ASD-7812-2345")
                .brand("Logitech")
                .build();
        Equipment equipment4 = Equipment.builder()
                .name("Mac Book Pro 13")
                .equipmentType(EquipmentType.PC)
                .owner(null)
                .serialNumber("ASD-1234-78721")
                .brand("Apple")
                .build();

        equipmentRepository.saveAll(List.of(equipment4, equipment1, equipment3, equipment2));
    }
}
