package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto;

import lombok.Builder;

@Builder
public record LocalizationDto(
        Long id,
        String department,
        String building,
        Integer floor,
        Integer roomNumber
) {
}
