export enum EquipmentType {
    PC = "PC",
    LAPTOP = "Laptop", 
    PRINTER = "Printer",
    MONITOR = "Monitor",
    TABLET = "Tablet"
}

export enum EquipmentState {
    ASSIGNED = "ASSIGNED",
    NOT_ASSIGNED = "NOT_ASSIGNED",
    BROKEN = "BROKEN",
    IN_SERVICE = "IN_SERVICE"
}

export const equipmentStateTypes = [
    EquipmentState.BROKEN,
    EquipmentState.IN_SERVICE,
    EquipmentState.NOT_ASSIGNED,
    EquipmentState.ASSIGNED
]

const allEquipmentTypes =  new Array<EquipmentType>
allEquipmentTypes.push(EquipmentType.LAPTOP, EquipmentType.PC, EquipmentType.PRINTER);

export default allEquipmentTypes;

export interface Equipment {
    id: string;
    name: string;
    brand: string;
    serialNumber: string;
    equipmentType: EquipmentType;
    equipmentState?: EquipmentState;
    owner?: User
    localization?: Localization;
}

export interface User {
    id?: string | number;
    firstname: string;
    lastname: string;
    email: string;
    equipmentIds?: string[] | number[];
    role?: string;
}

export interface UserAndEquipmentsIds {
    user: User;
    equipmentIds: string[];
}

export interface Localization {
    id?: string;
    department: string;
    building: string;
    floor: number;
    roomNumber: number;
}

export interface EquipmentWithLocalization {
    equipment: Equipment;
    localization: Localization;
}