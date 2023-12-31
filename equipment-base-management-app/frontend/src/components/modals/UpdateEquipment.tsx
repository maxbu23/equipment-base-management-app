import { Button, Form, Modal } from "react-bootstrap";
import { Equipment, EquipmentState, EquipmentType, EquipmentWithLocalization, equipmentStateTypes } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipment: Equipment; 
}

const UpdateEquipment = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt")

    const [updatingId, setUpdatingId] = useState(props.equipment.id);
    const [updatingName, setUpdatingName] = useState(props.equipment.name);
    const [updatingBrand, setUpdatingBrand] = useState(props.equipment.brand);
    const [updatingSerialNumber, setUpdatingSerialNumber] = useState(props.equipment.serialNumber);
    // todo:
    // const [updatingBarcode, setUpdatingBarcode] = useState(props.equipment.barcode);
    const [updatingType, setUpdatingType] = useState(props.equipment.equipmentType.toString());
    const [updatingState, setUpdatingState] = useState(props.equipment.equipmentState?.toString());

    useEffect(() => {
        setUpdatingId(props.equipment.id);
        setUpdatingName(props.equipment.name);
        setUpdatingBrand(props.equipment.brand);
        setUpdatingSerialNumber(props.equipment.serialNumber);
        setUpdatingType(props.equipment.equipmentType);
        setUpdatingState(props.equipment.equipmentState)
    }, [props])

    function sendCreateNewEquipmentRequest() {
        const updatedEquipment: Equipment = createUpdatedEquipment()
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

    function createUpdatedEquipment() : Equipment {
        let newEquipment = {
                id: updatingId,
                name: updatingName,
                brand: updatingBrand,
                serialNumber: updatingSerialNumber,
                equipmentType: updatingType as EquipmentType,
                equipmentState: updatingState as EquipmentState
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
                    <Form.Label>Barcode</Form.Label>
                    <Form.Control value="1230982891" onChange={(event) => setUpdatingSerialNumber(event.target.value)} />
                    {updatingState !== "ASSIGNED" ? 
                        <div>
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={updatingState} onChange={(event) => setUpdatingState(event.target.value)}>
                            <option color="red" value="">Select equipment state</option>
                                {equipmentStateTypes.filter((state) => state != "ASSIGNED").map((state) => (
                            <option key={state} value={state.toUpperCase()}>{state.toUpperCase()}</option>
                        ))}
                    </Form.Select>
                        </div> : <></>
                    }
                    <Button style={{width:"100%", marginTop: "10px"}} className='button' onClick={() => sendCreateNewEquipmentRequest()}>Update</Button>
                </div>            
            </div>   
          </Modal.Body>
        </Modal>
      );
}

export default UpdateEquipment;