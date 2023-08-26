package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
}
