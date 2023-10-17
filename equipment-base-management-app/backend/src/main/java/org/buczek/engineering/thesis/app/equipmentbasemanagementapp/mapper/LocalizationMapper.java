package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

import lombok.experimental.UtilityClass;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;

@UtilityClass
public class LocalizationMapper {

    public Localization mapLocalizationDtoToEntity(LocalizationDto localizationDto) {
        return Localization.builder()
                .department(localizationDto.department())
                .building(localizationDto.building())
                .floor(localizationDto.floor())
                .roomNumber(localizationDto.roomNumber())
                .build();
    }

    public LocalizationDto mapLocalizationEntityToDto(Localization localization) {
        return LocalizationDto.builder()
                .id(localization.getId())
                .department(localization.getDepartment())
                .building(localization.getBuilding())
                .floor(localization.getFloor())
                .roomNumber(localization.getRoomNumber())
                .build();
    }
}
