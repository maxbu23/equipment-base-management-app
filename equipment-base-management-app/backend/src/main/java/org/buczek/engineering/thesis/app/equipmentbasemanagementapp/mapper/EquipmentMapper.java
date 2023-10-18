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
        return Equipment.builder()
                .name(equipmentDto.name())
                .equipmentType(equipmentDto.equipmentType())
                .equipmentState(equipmentDto.equipmentState())
                .serialNumber(equipmentDto.serialNumber())
                .brand(equipmentDto.brand())
                .build();
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
