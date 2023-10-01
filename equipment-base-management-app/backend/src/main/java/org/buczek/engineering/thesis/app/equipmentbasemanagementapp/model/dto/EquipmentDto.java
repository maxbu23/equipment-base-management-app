package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import lombok.Builder;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;

@Builder
public record EquipmentDto(
        String name,
        String brand,
        String serialNumber,
        EquipmentType equipmentType,
        Long userId
) {

}
