package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.EquipmentMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.LocalizationMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.UserMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.AssignEquipmentRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.ChangeEquipmentLocalization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils.XLSXReader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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

    public List<EquipmentDto> getEquipmentsByUserId(Long ownerId) {
        return equipmentRepository.findByOwnerId(ownerId).stream()
                .map(equipmentMapper::entityToDto).toList();
    }

    public void updateEquipment(EquipmentDto equipmentDto) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findById(equipmentDto.id());
        if (equipmentOptional.isPresent()) {
            Equipment equipment = equipmentOptional.get();
            User owner = equipment.getOwner();
            Localization localization = equipment.getLocalization();
            Equipment updatedEquipment = equipmentMapper.dtoToEntity(equipmentDto);
            updatedEquipment.setOwner(owner);
            updatedEquipment.setLocalization(localization);
            updatedEquipment.setId(equipment.getId());
            equipmentRepository.save(updatedEquipment);
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

        log.info("Assigned equipment({}) to user({}) and localization({})", equipment, owner, localization);
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

    public EquipmentDto getEquipmentByBarcode(String barcode) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findByBarcode(barcode);

        if (equipmentOptional.isEmpty()) {
            throw new EntityNotFoundException();
        }

        return equipmentMapper.entityToDto(equipmentOptional.get());
    }

    public void saveImportedEquipments(MultipartFile multipartFile, boolean force) {
        try {
            log.info("Importing equipment data...");
            List<Equipment> equipments = xlsxReader.readEquipmentsFromXLSXFile(multipartFile);
            if (force) {
                equipmentRepository.deleteAll();
            }
            equipmentRepository.saveAll(equipments);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void changeEquipmentLocalization(ChangeEquipmentLocalization request) {
        Optional<Equipment> equipmentOptional = equipmentRepository.findById(request.equipmentId());
        if (equipmentOptional.isEmpty()) {
            throw new EntityNotFoundException("Equipment with ID " + request.equipmentId() + " does not exists.");
        }
        Localization localization = localizationService.findLocalizationById(request.localizationId());
        Equipment equipment = equipmentOptional.get();
        Localization oldLocalization = equipment.getLocalization();
        equipment.setLocalization(localization);
        equipmentRepository.save(equipment);
        
        log.info("Changed localization({}) to localization({}) for equipment({})", oldLocalization, localization, equipment);
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

}
