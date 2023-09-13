package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@CrossOrigin("*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping("/equipments")
    public void addNewEquipment(@RequestBody EquipmentDto equipmentDto) {
        equipmentService.saveNewEquipment(equipmentDto);
    }

}
