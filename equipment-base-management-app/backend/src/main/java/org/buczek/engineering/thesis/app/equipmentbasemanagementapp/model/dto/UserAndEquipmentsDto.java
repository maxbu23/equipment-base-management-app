package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class UserAndEquipmentsDto {

    private UserDto user;
    private List<Long> equipmentIds;
}
