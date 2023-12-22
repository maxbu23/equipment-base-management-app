package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder()
public class Equipment {

    @GeneratedValue
    @Id
    private Long id;
    private String name;
    private String brand;
    private String serialNumber;
    private String inventoryNumber;
    private BigDecimal value;
    private LocalDate boughtDate;
    private String barcode;
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;
    @Enumerated(EnumType.STRING)
    private EquipmentState equipmentState;
    @ManyToOne
    private User owner;
    @ManyToOne
    private Localization localization;
    private String elements;

}
