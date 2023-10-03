package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    public void saveNewEquipment(EquipmentDto equipmentDto) {

        Long userId = equipmentDto.userId();
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            log.info("User with id: {} has benn found", userId);
            equipmentRepository.save(mapEquipmentDtoToEntity(equipmentDto, user.get()));
        } else {
            equipmentRepository.save(mapEquipmentDtoToEntity(equipmentDto, null));
        }
    }

    public List<EquipmentDto> getAllEquipments() {
        return equipmentRepository.findAll().stream().map(this::mapEquipmentEntityToDto).collect(Collectors.toList());
    }

    public List<EquipmentDto> getAllEquipmentsByUserId(long userId) {
        return equipmentRepository.findByOwnerId(userId).stream().map(this::mapEquipmentEntityToDto).collect(Collectors.toList());
    }

    private Equipment mapEquipmentDtoToEntity(EquipmentDto equipmentDto, User user) {
        return Equipment.builder()
                .name(equipmentDto.name())
                .brand(equipmentDto.brand())
                .equipmentType(equipmentDto.equipmentType())
                .serialNumber(equipmentDto.serialNumber())
                .owner(user)
                .build();
    }

    private EquipmentDto mapEquipmentEntityToDto(Equipment equipment) {
        return EquipmentDto.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .brand(equipment.getBrand())
                .equipmentType(equipment.getEquipmentType())
                .serialNumber(equipment.getSerialNumber())
                .userId(equipment.getOwner() != null ? equipment.getOwner().getId() : -1)
                .build();
    }
}
