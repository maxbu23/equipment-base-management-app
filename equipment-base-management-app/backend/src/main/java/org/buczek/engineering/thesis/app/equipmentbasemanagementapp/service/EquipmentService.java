package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.EquipmentMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.LocalizationMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.UserMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentWithLocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.AssignEquipmentRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.LocalizationRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.export.ExportService;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils.XLSXReader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    private final UserService userService;
    private final LocalizationService localizationService;

    private final UserMapper userMapper;
    private final LocalizationMapper localizationMapper;
    private final EquipmentMapper equipmentMapper;

    private XLSXReader xlsxReader;

    public void saveNewEquipment(EquipmentDto equipmentDto) {
        equipmentRepository.save(equipmentMapper.dtoToEntity(equipmentDto));
    }

    public List<EquipmentDto> getAllEquipments() {
        List<Equipment> equipments = equipmentRepository.findAll();
        return equipments.stream()
                .map(this::mapEquipmentEntityToDto)
                .toList();
    }

    public List<EquipmentDto> getUserEquipments(Long ownerId) {
        return equipmentRepository.findByOwnerId(ownerId).stream()
                .map(equipmentMapper::entityToDto).toList();
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
        Optional<Equipment> equipmentOptional = equipmentRepository.findById(equipmentDto.id());
        if (equipmentOptional.isPresent()) {
            equipmentRepository.save(equipmentMapper.dtoToEntity(equipmentDto));

        }
    }

    public void assignEquipment(AssignEquipmentRequest request) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findById(request.equipmentId());

        if (equipmentOptional.isEmpty()) {
            throw new EntityNotFoundException("Equipment with ID " + request.equipmentId() + " does not exists.");
        }

        User owner = userService.findUserById(request.userId());
        Localization localization = localizationService.findLocalizationById(request.localizationId());
        Equipment equipment = equipmentOptional.get();
        prepareEquipmentToAssignment(equipment, owner, localization);
        equipmentRepository.save(equipment);
    }

    public void removeEquipmentAssignment(Long equipmentId) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findById(equipmentId);
        if (equipmentOptional.isEmpty()) {
            throw new EntityNotFoundException("Equipment with ID " + equipmentId + " does not exists.");
        }
        Equipment equipment = equipmentOptional.get();
        prepareEquipmentToRemoveAssignment(equipment);
        equipmentRepository.save(equipment);
    }

    public void deleteEquipment(long equipmentId) {
        equipmentRepository.deleteById(equipmentId);
    }

    private void prepareEquipmentToAssignment(Equipment equipment, User owner, Localization localization) {
        equipment.setOwner(owner);
        equipment.setLocalization(localization);
        equipment.setEquipmentState(EquipmentState.ASSIGNED);
    }

    private void prepareEquipmentToRemoveAssignment(Equipment equipment) {
        equipment.setOwner(null);
        equipment.setLocalization(null);
        equipment.setEquipmentState(EquipmentState.NOT_ASSIGNED);
    }

    private EquipmentDto mapEquipmentEntityToDto(Equipment equipment) {
        return EquipmentDto.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .brand(equipment.getBrand())
                .equipmentType(equipment.getEquipmentType())
                .serialNumber(equipment.getSerialNumber())
                .owner(userMapper.entityToDto(equipment.getOwner()))
                .localization(localizationMapper.entityToDto(equipment.getLocalization()))
                .equipmentState(equipment.getEquipmentState())
                .build();
    }

    public EquipmentDto getEquipmentByBarcode(String barcode) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findByBarcode(barcode);

        if (equipmentOptional.isEmpty()) {
            throw new EntityNotFoundException();
        }

        return equipmentMapper.entityToDto(equipmentOptional.get());
    }

    public void saveImportedEquipments(MultipartFile multipartFile) {
        try {
            xlsxReader.readEquipmentsFromXLSXFile(multipartFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
