export enum EquipmentType {
    PC = "PC",
    LAPTOP = "Laptop", 
    PRINTER = "Printer"
}

const allEquipmentTypes =  new Array<EquipmentType>
allEquipmentTypes.push(EquipmentType.LAPTOP, EquipmentType.PC, EquipmentType.PRINTER);

export default allEquipmentTypes;

export interface Equipment {
    id?: number;
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