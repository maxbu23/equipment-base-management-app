import { Button, Form, Modal } from "react-bootstrap";
import { Equipment, EquipmentType, EquipmentWithLocalization } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipmentWithLocalization: EquipmentWithLocalization; 
}

const UpdateEquipment = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt")

    const [updatingId, setUpdatingId] = useState(props.equipmentWithLocalization.equipment.id);
    const [updatingName, setUpdatingName] = useState(props.equipmentWithLocalization.equipment.name);
    const [updatingBrand, setUpdatingBrand] = useState(props.equipmentWithLocalization.equipment.brand);
    const [updatingSerialNumber, setUpdatingSerialNumber] = useState(props.equipmentWithLocalization.equipment.serialNumber);
    const [updatingType, setUpdatingType] = useState(props.equipmentWithLocalization.equipment.equipmentType.toString());
    const [updatingDepartment, setUpdatingDepartment] = useState("");
    const [updatingBuilding, setUpdatingBuilding] = useState("");
    const [updatingFloor, setUpdatingFloor] = useState<number | string>()
    const [updatingRoomNumber, setUpdatngRoomNumber] = useState<number | string>()

    useEffect(() => {
        setUpdatingId(props.equipmentWithLocalization.equipment.id);
        setUpdatingName(props.equipmentWithLocalization.equipment.name);
        setUpdatingBrand(props.equipmentWithLocalization.equipment.brand);
        setUpdatingSerialNumber(props.equipmentWithLocalization.equipment.serialNumber);
        setUpdatingType(props.equipmentWithLocalization.equipment.equipmentType);

        if (props.equipmentWithLocalization.localization) {
            setUpdatingDepartment(props.equipmentWithLocalization.localization.department);
            setUpdatingBuilding(props.equipmentWithLocalization.localization.building);
            setUpdatingFloor(props.equipmentWithLocalization.localization.floor);
            setUpdatngRoomNumber(props.equipmentWithLocalization.localization.roomNumber);
        } else {
            setUpdatingDepartment("");
            setUpdatingBuilding("");
            setUpdatingFloor("");
            setUpdatngRoomNumber("");
        }

    }, [props])

    function sendCreateNewEquipmentRequest() {
        const updatedEquipment: EquipmentWithLocalization = createUpdatedEquipment()
        axios.put(
            `/api/v1/admin/equipments`,
            updatedEquipment,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                window.location.href = 'admin-dashboard'
            }
        })
    }

    function createUpdatedEquipment() : EquipmentWithLocalization {
        let newEquipment = {
            equipment: {
                id: updatingId,
                name: updatingName,
                brand: updatingBrand,
                serialNumber: updatingSerialNumber,
                equipmentType: updatingType as EquipmentType
            },
            localization: {
                department: updatingDepartment,
                building: updatingBuilding,
                floor: updatingFloor as number,
                roomNumber: updatingRoomNumber as number
            }
        }
        return newEquipment;
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Update equipment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
                <div className='registration-form-user'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={updatingName} onChange={(event) => setUpdatingName(event.target.value) }/>
                    <Form.Label>Equipment type</Form.Label>
                    <Form.Select value={updatingType} onChange={(event) => setUpdatingType(event.target.value)}>
                        <option color="red" value="">Select equipment type</option>
                        {Object.values(EquipmentType).map((type) => (
                            <option key={type} value={type.toUpperCase()}>{type.toUpperCase()}</option>
                        ))}
                    </Form.Select>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control value={updatingBrand} onChange={(event) => setUpdatingBrand(event.target.value)}/>
                    <Form.Label>Serial number</Form.Label>
                    <Form.Control value={updatingSerialNumber} onChange={(event) => setUpdatingSerialNumber(event.target.value)} />
                    <Form.Label>Department</Form.Label>
                    <Form.Control value={updatingDepartment} onChange={(event) => setUpdatingDepartment(event.target.value)} />
                    <Form.Label>Building</Form.Label>
                    <Form.Control value={updatingBuilding} onChange={(event) => setUpdatingBuilding(event.target.value)} />
                    <Form.Label>Floor</Form.Label>
                    <Form.Control value={updatingFloor} onChange={(event) => setUpdatingFloor(event.target.value)} />
                    <Form.Label>Room number</Form.Label>
                    <Form.Control value={updatingRoomNumber} onChange={(event) => setUpdatngRoomNumber(event.target.value)} />
                    
                    <Button style={{width:"100%", marginTop: "10px"}} className='button' onClick={() => sendCreateNewEquipmentRequest()}>Update</Button>
                </div>            
            </div>   
          </Modal.Body>
        </Modal>
      );
}

export default UpdateEquipment;