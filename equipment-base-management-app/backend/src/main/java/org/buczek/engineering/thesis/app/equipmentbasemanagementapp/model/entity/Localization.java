package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Localization {

    @GeneratedValue
    @Id
    private Long id;
    private String department;
    private String building;
    private Integer floor;
    private Integer roomNumber;

}
