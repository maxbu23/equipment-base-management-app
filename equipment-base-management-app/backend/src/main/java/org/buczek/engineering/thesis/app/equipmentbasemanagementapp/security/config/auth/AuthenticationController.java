package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth;

import lombok.RequiredArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.AuthenticationRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.ChangePasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticateService authenticateService;

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest) {
        authenticateService.register(registerRequest);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest registerRequest) {
        return ResponseEntity.ok(authenticateService.authenticate(registerRequest));
    }

    @PostMapping("/changePassword")
    public void changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        authenticateService.changePassword(changePasswordRequest);
    }

    @PostMapping("/recoverPassword")
    public void recoverPassword(@RequestBody String email) {
        authenticateService.recoverPassword(email);
    }
}
