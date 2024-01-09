package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class EquipmentMapper {

    private final LocalizationMapper localizationMapper;
    private final UserMapper userMapper;

    public Equipment dtoToEntity(EquipmentDto equipmentDto) {
        return Equipment.builder()
                .id(equipmentDto.id())
                .name(equipmentDto.name())
                .equipmentType(equipmentDto.equipmentType())
                .equipmentState(equipmentDto.equipmentState() != null ? equipmentDto.equipmentState() : EquipmentState.NOT_ASSIGNED)
                .serialNumber(equipmentDto.serialNumber())
                .brand(equipmentDto.brand())
                .build();
    }

    public EquipmentDto entityToDto(Equipment equipment) {
        return EquipmentDto.builder()
                .id(equipment.getId())
                .equipmentType(equipment.getEquipmentType())
                .name(equipment.getName())
                .brand(equipment.getBrand())
                .serialNumber(equipment.getSerialNumber())
                .barcode(equipment.getBarcode())
                .localization(localizationMapper.entityToDto(equipment.getLocalization()))
                .owner(userMapper.entityToDto(equipment.getOwner()))
                .build();
    }
}
