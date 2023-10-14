package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

        if (userId != null) {
            Optional<User> user = userRepository.findById(userId);
            user.ifPresent(value -> equipmentRepository.save(mapEquipmentDtoToEntity(equipmentDto, value)));
        } else {
            equipmentRepository.save(mapEquipmentDtoToEntity(equipmentDto, null));
        }
    }

    public List<EquipmentDto> getAllEquipments() {
        return equipmentRepository.findAll().stream().map(this::mapEquipmentEntityToDto).collect(Collectors.toList());
    }

    public List<EquipmentDto> getAllAvailableEquipments() {
        return equipmentRepository.getAllAvailableEquipments().stream().map(this::mapEquipmentEntityToDto).collect(Collectors.toList());
    }

    public List<EquipmentDto> getUserAndAllAvailableEquipments(long userId) {
        List<EquipmentDto> availableEquipments = equipmentRepository.getAllAvailableEquipments().stream().map(this::mapEquipmentEntityToDto).toList();
        List<EquipmentDto> userEquipments = equipmentRepository.findByOwnerId(userId).stream().map(this::mapEquipmentEntityToDto).toList();

        ArrayList<EquipmentDto> userAndAvailableEquipments = new ArrayList<>();
        userAndAvailableEquipments.addAll(userEquipments);
        userAndAvailableEquipments.addAll(availableEquipments);
        return userAndAvailableEquipments;
    }

    public List<EquipmentDto> getAllEquipmentsByUserId(long userId) {
        return equipmentRepository.findByOwnerId(userId).stream().map(this::mapEquipmentEntityToDto).collect(Collectors.toList());
    }

    public void updateEquipment(EquipmentDto equipmentDto) {
        equipmentRepository.save(mapEquipmentDtoToEntity(equipmentDto));
    }

    public void deleteEquipment(long equipmentId) {
        equipmentRepository.deleteById(equipmentId);
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

    private Equipment mapEquipmentDtoToEntity(EquipmentDto equipmentDto) {
        return Equipment.builder()
                .id(equipmentDto.id())
                .name(equipmentDto.name())
                .brand(equipmentDto.brand())
                .equipmentType(equipmentDto.equipmentType())
                .serialNumber(equipmentDto.serialNumber())
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
                .equipmentState(equipment.getEquipmentState())
                .build();
    }
}
