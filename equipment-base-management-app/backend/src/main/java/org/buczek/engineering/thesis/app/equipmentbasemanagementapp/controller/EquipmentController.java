package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.AssignEquipmentRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.ChangeEquipmentLocalization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(value = "*")
@Slf4j
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping("/admin/equipments")
    public void addNewEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.saveNewEquipment(equipmentDto);
    }

    @GetMapping("/admin/equipments/{ownerId}")
    public List<EquipmentDto> getUserEquipments(@PathVariable("ownerId") Long ownerId) {
        return equipmentService.getEquipmentsByUserId(ownerId);
    }

    @PutMapping("/admin/equipments")
    public void updateEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.updateEquipment(equipmentDto);
    }

    @PutMapping("/admin/equipments/assign")
    public void assignEquipment(@RequestBody AssignEquipmentRequest request) {
        equipmentService.assignEquipment(request);
    }

    @PutMapping("/admin/equipments/remove-assignment/{equipmentId}")
    public void removeEquipmentAssignment(@PathVariable("equipmentId") Long equipmentId) {
        equipmentService.removeEquipmentAssignment(equipmentId);
    }
    @DeleteMapping("/admin/equipments/{equipmentId}")
    public void deleteEquipment(@PathVariable("equipmentId") long equipmentId) {
        log.info("Deleting equipment with id: {}", equipmentId);
        equipmentService.deleteEquipment(equipmentId);
    }

    @GetMapping("/user/equipments/{userId}")
    public List<EquipmentDto> getAllEquipmentsByUserId(@PathVariable("userId") long userId) {
        List<EquipmentDto> allEquipmentsByUserId = equipmentService.getEquipmentsByUserId(userId);
        log.info("Id: {} Equipments: {}", userId, allEquipmentsByUserId);
        return allEquipmentsByUserId;
    }

    @GetMapping("/user/equipments/barcodes/{barcode}")
    public EquipmentDto getEquipmentByBarcode(@PathVariable String barcode) {
        return equipmentService.getEquipmentByBarcode(barcode);
    }

    @PutMapping("/user/equipments/localization")
    public void changeEquipmentLocalization(@RequestBody ChangeEquipmentLocalization request) {
        equipmentService.changeEquipmentLocalization(request);
    }

    @GetMapping("/equipments")
    public List<EquipmentDto> getAllEquipments() {
        return equipmentService.getAllEquipments();
    }
}
