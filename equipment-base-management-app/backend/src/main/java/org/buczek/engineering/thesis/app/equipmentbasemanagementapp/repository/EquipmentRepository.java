package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByOwnerId(Long ownerId);

}
