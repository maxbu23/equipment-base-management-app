package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request;

public record AssignEquipmentRequest(
        Long userId,
        Long equipmentId,
        Long localizationId
) {}
