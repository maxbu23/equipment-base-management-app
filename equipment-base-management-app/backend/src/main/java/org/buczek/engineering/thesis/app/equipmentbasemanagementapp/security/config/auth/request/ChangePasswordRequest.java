package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request;

public record ChangePasswordRequest(
        Long userId,
        String currentPassword,
        String newPassword
) {
}
