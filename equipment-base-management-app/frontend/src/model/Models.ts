enum EquipmentType {
    PC, LAPTOP, PRINTER
}

export interface Equipment {
    id: number;
    name: string;
    brand: string;
    serialNumber: string;
    equipmentType: EquipmentType;
}

export interface User {
    id?: string | number;
    firstname: string;
    lastname: string;
    email: string;
    equipmentIds?: string[] | number[]
}