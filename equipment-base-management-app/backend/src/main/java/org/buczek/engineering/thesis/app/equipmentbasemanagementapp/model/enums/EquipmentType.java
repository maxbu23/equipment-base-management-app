package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EquipmentType {

    PC("PC"), LAPTOP("LAPTOP"), PRINTER("PRINTER"), TABLET("TABLET"), MONITOR("MONITOR"),
    PST("pst"), ELEMENT("Element"), WNP("wnp"), ST("st");

    private final String value;

    public static EquipmentType fromValue(String stringValue) {
        return EquipmentType.valueOf(stringValue.toUpperCase());
    }

}
