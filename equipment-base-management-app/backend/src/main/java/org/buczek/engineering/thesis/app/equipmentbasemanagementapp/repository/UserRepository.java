package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

}
