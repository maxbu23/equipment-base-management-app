package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request;

public record ChangePasswordRequest(
        Long userId,
        String currentPassword,
        String newPassword
) {
}
