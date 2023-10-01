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
@CrossOrigin(allowedHeaders = {"*"}, value = "*")
@Slf4j
public class EquipmentController {

    private final EquipmentService equipmentService;

//    @PostMapping("/equipments")
//    public void addNewEquipment(@RequestBody EquipmentDto equipmentDto) {
//        equipmentService.saveNewEquipment(equipmentDto);
//    }

    @GetMapping("/equipments")
    public List<EquipmentDto> getAllEquipments() {
        log.info("DONE");
        return equipmentService.getAllEquipments();
    }
}
