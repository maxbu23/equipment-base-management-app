package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Equipment {

    @GeneratedValue
    @Id
    private Long id;
    private String name;
    private String brand;
    private String serialNumber;
    private EquipmentType equipmentType;
    @ManyToOne
    private User owner;

}
