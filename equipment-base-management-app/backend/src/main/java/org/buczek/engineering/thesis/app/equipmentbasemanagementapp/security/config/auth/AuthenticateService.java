package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config.exception.IncorrectPasswordException;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.JwtService;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.AuthenticationRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.ChangePasswordRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils.PasswordGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticateService {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordGenerator passwordGenerator;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        User user = User.builder()
                .firstname(registerRequest.getFirstname())
                .lastname(registerRequest.getLastname())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(passwordGenerator.generatePassword()))
                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);

        List<Equipment> equipmentsToAssign = equipmentRepository.findAllById(registerRequest.getEquipmentIds());
        equipmentsToAssign.forEach(e -> e.setOwner(savedUser));
        equipmentsToAssign.forEach(e -> e.setEquipmentState(EquipmentState.ASSIGNED));
        equipmentRepository.saveAll(equipmentsToAssign);

        return generateAuthenticationResponse(user);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest registerRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(registerRequest.getEmail()).orElseThrow();
        return generateAuthenticationResponse(user);
    }

    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        Optional<User> userOptional = userRepository.findById(changePasswordRequest.userId());
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("Cannot find user with id: " + changePasswordRequest.userId());
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(changePasswordRequest.currentPassword(), user.getPassword())) {
            throw new IncorrectPasswordException();
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.newPassword()));
        userRepository.save(user);
        log.info("Password has been changed successfully");
    }

    private AuthenticationResponse generateAuthenticationResponse(User user) {
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .id(user.getId())
                .jwtToken(jwtToken)
                .role(user.getRole())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .build();
    }
}
