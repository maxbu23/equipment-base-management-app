package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.RequiredArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.AuthenticationRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.ChangePasswordRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.RegisterRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.response.AuthenticationResponse;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.AuthenticateService;
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
