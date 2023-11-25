package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByOwnerId(Long ownerId);
    Optional<Equipment> findByBarcode(String barcode);
    @Query("SELECT e FROM Equipment e WHERE e.owner.id = null")
    List<Equipment> getAllAvailableEquipments();

//    @Modifying
//    @Query("UPDATE Equipment e SET e.owner.id = null WHERE e.owner.id = :ownerId")
//    void unassignedEquipments(@Param("ownerId") Long ownerId);
}
