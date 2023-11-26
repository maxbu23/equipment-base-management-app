package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config.exception.IncorrectPasswordException;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.UserRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.JwtService;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.AuthenticationRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config.auth.request.ChangePasswordRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.email.EmailSenderService;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils.PasswordGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticateService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordGenerator passwordGenerator;
    private final EmailSenderService emailSenderService;

    public void register(RegisterRequest registerRequest) {
        String password = passwordGenerator.generatePassword();
        User user = User.builder()
                .firstname(registerRequest.getFirstname())
                .lastname(registerRequest.getLastname())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        emailSenderService.sendEmail(registerRequest.getEmail(), "Registration", "Password: " + password);
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

    public void recoverPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User with email {} does not exist: " + email);
        }

        User user = userOptional.get();
        String newPassword = passwordGenerator.generatePassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        emailSenderService.sendEmail(email, "Recovery password", "New password: " + newPassword);
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
