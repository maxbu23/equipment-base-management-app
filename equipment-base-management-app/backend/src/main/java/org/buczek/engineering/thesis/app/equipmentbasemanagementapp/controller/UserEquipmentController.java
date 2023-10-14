package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user")
@CrossOrigin(value = "*")
@Slf4j
public class UserEquipmentController {

    private final EquipmentService equipmentService;
    @GetMapping("/equipments/{userId}")
    public List<EquipmentDto> getAllEquipmentsByUserId(@PathVariable("userId") long userId) {
        List<EquipmentDto> allEquipmentsByUserId = equipmentService.getAllEquipmentsByUserId(userId);
        log.info("Id: {} Equipments: {}", userId, allEquipmentsByUserId);
        return allEquipmentsByUserId;
    }
}
