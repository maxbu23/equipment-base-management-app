package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(allowedHeaders = {"*"}, value = "*")
@Slf4j
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping("/admin/equipments")
    public void addNewEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.saveNewEquipment(equipmentDto);
    }

    @GetMapping("/admin/equipments")
    public List<EquipmentDto> getAllEquipments() {
        return equipmentService.getAllEquipments();
    }

    @GetMapping("/user/equipments/{userId}")
    public List<EquipmentDto> getAllEquipmentsByUserId(@PathVariable("userId") long userId) {
        List<EquipmentDto> allEquipmentsByUserId = equipmentService.getAllEquipmentsByUserId(userId);
        log.info("Id: {} Equipments: {}", userId, allEquipmentsByUserId);
        return allEquipmentsByUserId;
    }

    @GetMapping("/admin/equipments/available")
    public List<EquipmentDto> getAllAvailableEquipments() {
        List<EquipmentDto> allAvailableEquipments = equipmentService.getAllAvailableEquipments();
        log.info("Available equipments: {}", allAvailableEquipments);
        return allAvailableEquipments;
    }
}
