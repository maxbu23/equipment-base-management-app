package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class EquipmentMapper implements Mapper<Equipment, EquipmentDto>{

    private final LocalizationMapper localizationMapper;

    @Override
    public Equipment dtoToEntity(EquipmentDto equipmentDto) {
        return null;
    }

    @Override
    public EquipmentDto entityToDto(Equipment equipment) {
        return EquipmentDto.builder()
                .equipmentType(equipment.getEquipmentType())
                .name(equipment.getName())
                .brand(equipment.getBrand())
                .serialNumber(equipment.getSerialNumber())
                .localization(localizationMapper.entityToDto(equipment.getLocalization()))
                .build();
    }
}
