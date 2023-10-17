package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

public record EquipmentWithLocalizationDto(
        EquipmentDto equipment,
        LocalizationDto localization
) {

}
