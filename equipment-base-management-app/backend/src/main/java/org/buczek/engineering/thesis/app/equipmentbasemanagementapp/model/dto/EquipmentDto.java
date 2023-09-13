package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;

public record EquipmentDto(
        String name,
        String brand,
        String serialNumber,
        EquipmentType equipmentType,
        Long userId
) {

}
