package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import lombok.Builder;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;

@Builder
public record EquipmentDto(
        Long id,
        String name,
        String brand,
        String serialNumber,
        EquipmentType equipmentType,
        EquipmentState equipmentState,
        Long userId
) {

}
