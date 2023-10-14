package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@CrossOrigin(value = "*")
@Slf4j
public class AdminEquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping("/equipments")
    public void addNewEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.saveNewEquipment(equipmentDto);
    }

    @GetMapping("/equipments")
    public List<EquipmentDto> getAllEquipments() {
        return equipmentService.getAllEquipments();
    }

    @GetMapping("/equipments/available")
    public List<EquipmentDto> getAllAvailableEquipments() {
        List<EquipmentDto> allAvailableEquipments = equipmentService.getAllAvailableEquipments();
        log.info("Available equipments: {}", allAvailableEquipments);
        return allAvailableEquipments;
    }

    @GetMapping("/equipments/userAndAvailable/{userId}")
    public List<EquipmentDto> getUserAndAllAvailableEquipments(@PathVariable("userId") long userId) {
        return equipmentService.getUserAndAllAvailableEquipments(userId);
    }

    @PutMapping("/equipments")
    public void updateEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.updateEquipment(equipmentDto);
    }
    @DeleteMapping("/equipments/{equipmentId}")
    public void deleteEquipment(@PathVariable("equipmentId") long equipmentId) {
        log.info("Deleting equipment with id: {}", equipmentId);
        equipmentService.deleteEquipment(equipmentId);
    }
}