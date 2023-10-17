package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

import lombok.experimental.UtilityClass;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.springframework.stereotype.Component;

@Component
public class LocalizationMapper implements Mapper<Localization, LocalizationDto>{

    public Localization dtoToEntity(LocalizationDto localizationDto) {
        return Localization.builder()
                .department(localizationDto.department())
                .building(localizationDto.building())
                .floor(localizationDto.floor())
                .roomNumber(localizationDto.roomNumber())
                .build();
    }

    public LocalizationDto entityToDto(Localization localization) {
        if(localization != null ) {
            return LocalizationDto.builder()
                    .id(localization.getId())
                    .department(localization.getDepartment())
                    .building(localization.getBuilding())
                    .floor(localization.getFloor())
                    .roomNumber(localization.getRoomNumber())
                    .build();
        }
        return null;
    }
}
