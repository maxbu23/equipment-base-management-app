package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserAndEquipmentsDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.UserDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@CrossOrigin("*")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users")
    public void updateUser(@RequestBody UserAndEquipmentsDto userAndEquipmentsDto) {
        userService.updateUser(userAndEquipmentsDto);
    }
    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable("userId") long userId) {
        userService.deleteUserById(userId);
    }
}
