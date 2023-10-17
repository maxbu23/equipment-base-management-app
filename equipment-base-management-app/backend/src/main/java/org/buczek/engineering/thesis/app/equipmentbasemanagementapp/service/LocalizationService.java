package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.LocalizationMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.LocalizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class LocalizationService {

    private final LocalizationRepository localizationRepository;
    private final LocalizationMapper localizationMapper;

    public List<LocalizationDto> getAllLocalizations() {
        return localizationRepository.findAll().stream().map(localizationMapper::entityToDto).toList();
    }

    public Localization findLocalizationById(Long localizationId) {
        Optional<Localization> localization = localizationRepository.findById(localizationId);
        if (localization.isEmpty()) {
            throw new EntityNotFoundException("Localization with ID " + localization + " does not exists.");
        }
        return localization.get();
    }
}
