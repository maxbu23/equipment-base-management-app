package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

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
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;
    @ManyToOne
    private User owner;

}
