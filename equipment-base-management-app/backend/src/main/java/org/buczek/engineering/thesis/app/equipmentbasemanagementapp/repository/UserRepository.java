package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);

}

