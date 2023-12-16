package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User dtoToEntity(UserDto userDto) {
        return User.builder().build();
    }

    public UserDto entityToDto(User user) {
        if (user != null) {
            return UserDto.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstname(user.getFirstname())
                    .lastname(user.getLastname())
                    .build();
        }

        return null;
    }
}
