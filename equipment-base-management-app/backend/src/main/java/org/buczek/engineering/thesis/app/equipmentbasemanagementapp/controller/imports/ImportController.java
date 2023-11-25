package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller.imports;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@CrossOrigin(value = "*")
@Slf4j
public class ImportController {

    private final EquipmentService equipmentService;
    @PostMapping("/import")
    public void importEquipmentsFromFile(@RequestParam("file") MultipartFile multipartFile) {
//        System.out.println(multipartFile);
        System.out.println(multipartFile.getName());
        System.out.println(multipartFile.getContentType());
        System.out.println(multipartFile.getOriginalFilename());
        equipmentService.saveImportedEquipments(multipartFile);
    }
}
