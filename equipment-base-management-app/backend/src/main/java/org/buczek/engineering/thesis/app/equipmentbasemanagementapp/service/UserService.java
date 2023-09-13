package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void saveUser(UserDto userDto) {
        userRepository.save(mapUserDtoToEntity(userDto));
        //todo: if everything have been done successfully send password by email and save it somewhere
    }

    private User mapUserDtoToEntity(UserDto userDto) {
        return User.builder()
                .firstname(userDto.getFirstName())
                .lastname(userDto.getLastName())
                .email(userDto.getEmail())
                //todo: generate random password
                .password("")
                .build();
    }
}
