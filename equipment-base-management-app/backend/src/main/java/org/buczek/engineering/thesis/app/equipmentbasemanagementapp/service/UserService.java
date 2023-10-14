package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserAndEquipmentsDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.passay.DictionarySubstringRule.ERROR_CODE;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public void saveUser(UserDto userDto) {
        List<Equipment> equipmentsToAssign = equipmentRepository.findAllById(userDto.getEquipmentIds());
        log.info("Equipments to assign: {}", equipmentsToAssign);
        User owner = mapUserDtoToEntity(userDto);
        owner.setRole(Role.USER);
        owner.setPassword(passwordEncoder.encode(generatePassword()));
        equipmentsToAssign.forEach(e -> e.setOwner(owner));
        userRepository.save(owner);
        equipmentRepository.saveAll(equipmentsToAssign);
        //todo: if everything have been done successfully send password by email and save it somewhere
    }

    public void updateUser(UserAndEquipmentsDto userAndEquipmentsDto) {
        Optional<User> user = userRepository.findById(userAndEquipmentsDto.getUser().getId());
        if (user.isPresent()) {
            String password = user.get().getPassword();
            User updatedUser = mapUserDtoToEntity(userAndEquipmentsDto.getUser(), password);
            userRepository.save(updatedUser);

            List<Equipment> alreadyAssignedEquipments = equipmentRepository.findByOwnerId(userAndEquipmentsDto.getUser().getId());

            // setting equipments to unassigned
            alreadyAssignedEquipments.stream()
                            .filter(e -> !userAndEquipmentsDto.getEquipmentIds().contains(e.getId()))
                                    .forEach(e -> {
                                        e.setOwner(null);
                                        e.setEquipmentState(EquipmentState.NOT_ASSIGNED);
                                    });
            equipmentRepository.saveAll(alreadyAssignedEquipments);

            // setting equipments to assigned
            List<Equipment> notAssignedEquipmentsYet = equipmentRepository.findAllById(userAndEquipmentsDto.getEquipmentIds());
            notAssignedEquipmentsYet
                            .forEach(e -> {
                                e.setEquipmentState(EquipmentState.ASSIGNED);
                                e.setOwner(updatedUser);
                            });
            equipmentRepository.saveAll(notAssignedEquipmentsYet);
        }
    }

    public void deleteUserById(long userId) {
        List<Equipment> equipments = equipmentRepository.findByOwnerId(userId);
        for (Equipment equipment : equipments) {
            equipment.setOwner(null);
        }
        equipmentRepository.saveAll(equipments);
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll().stream().filter(u -> u.getRole().equals(Role.USER)).collect(Collectors.toList());
    }

    private User mapUserDtoToEntity(UserDto userDto) {
        return User.builder()
                .id(userDto.getId())
                .firstname(userDto.getFirstname())
                .lastname(userDto.getLastname())
                .email(userDto.getEmail())
                //todo: generate random password
                .password("")
                .role(Role.USER)
                .build();
    }

    private User mapUserDtoToEntity(UserDto userDto, String password) {
        return User.builder()
                .id(userDto.getId())
                .firstname(userDto.getFirstname())
                .lastname(userDto.getLastname())
                .email(userDto.getEmail())
                //todo: generate random password
                .password(password)
                .role(Role.USER)
                .build();
    }

    private String generatePassword() {
        PasswordGenerator passwordGenerator = new PasswordGenerator();
        CharacterData lowerCaseChars = EnglishCharacterData.LowerCase;
        CharacterRule lowerCaseRule = new CharacterRule(lowerCaseChars);
        lowerCaseRule.setNumberOfCharacters(2);

        CharacterData upperCaseChars = EnglishCharacterData.UpperCase;
        CharacterRule upperCaseRule = new CharacterRule(upperCaseChars);
        upperCaseRule.setNumberOfCharacters(2);

        CharacterData digitChars = EnglishCharacterData.Digit;
        CharacterRule digitRule = new CharacterRule(digitChars);
        digitRule.setNumberOfCharacters(2);

        CharacterData specialChars = new CharacterData() {
            public String getErrorCode() {
                return ERROR_CODE;
            }

            public String getCharacters() {
                return "!@#$%^&*()_+";
            }
        };
        CharacterRule splCharRule = new CharacterRule(specialChars);
        splCharRule.setNumberOfCharacters(2);

        String password = passwordGenerator.generatePassword(8, splCharRule, lowerCaseRule,
                upperCaseRule, digitRule);

        log.info("Generated password: {}", password);

        return password;
    }

    private void setOwnerAndEquipmentState(Equipment equipment, User owner) {

        if (equipment.getEquipmentState().equals(EquipmentState.NOT_ASSIGNED)) {
            equipment.setOwner(owner);
            equipment.setEquipmentState(EquipmentState.ASSIGNED);
        } else {
            equipment.setEquipmentState(EquipmentState.NOT_ASSIGNED);
            equipment.setOwner(null);
        }
    }
}
