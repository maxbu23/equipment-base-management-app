package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private User mapUserDtoToEntity(UserDto userDto) {
        return User.builder()
                .firstname(userDto.getFirstname())
                .lastname(userDto.getLastname())
                .email(userDto.getEmail())
                //todo: generate random password
                .password("")
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
}
