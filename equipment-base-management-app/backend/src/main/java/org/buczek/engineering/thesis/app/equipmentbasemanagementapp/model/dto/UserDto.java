package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserDto {

    private String firstName;
    private String lastName;
    private String email;

}
