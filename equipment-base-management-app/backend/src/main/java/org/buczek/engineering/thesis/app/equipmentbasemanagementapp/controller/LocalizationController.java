package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.LocalizationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class LocalizationController {

    private final LocalizationService localizationService;

    @GetMapping("/localizations")
    public List<LocalizationDto> getAllLocalizations() {
        return localizationService.getAllLocalizations();
    }
}
