package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.util.mapper;

import lombok.experimental.UtilityClass;
import org.apache.catalina.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.UserEntity;

@UtilityClass
public class DtoToEntityMapper {

    public UserEntity toUserEntity(UserDto userDto) {
        return UserEntity.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .build();
    }
}
