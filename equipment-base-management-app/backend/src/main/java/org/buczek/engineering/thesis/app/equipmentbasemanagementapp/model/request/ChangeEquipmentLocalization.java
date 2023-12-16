package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request;

public record ChangeEquipmentLocalization(
        Long equipmentId,
        Long localizationId
) {
}
