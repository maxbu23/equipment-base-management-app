import { Button, Form, Modal } from "react-bootstrap";
import { Equipment, EquipmentType } from "../../model/Models";
import { useState } from "react";
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

    const [updatingId, setUpdatingId] = useState(props.equipment.id)
    const [updatingName, setUpdatingName] = useState(props.equipment.name);
    const [updatingBrand, setUpdatingBrand] = useState(props.equipment.brand);
    const [updatingSerialNumber, setUpdatingSerialNumber] = useState(props.equipment.serialNumber)
    const [updatingType, setUpdatingType] = useState(props.equipment.equipmentType.toString())

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
            equipmentType: updatingType as EquipmentType
        }
        return newEquipment;
    }

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
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
                        <option value={type.toUpperCase()}>{type.toUpperCase()}</option>
                    ))}
                </Form.Select>
                <Form.Label>Brand</Form.Label>
                <Form.Control value={updatingBrand} onChange={(event) => setUpdatingBrand(event.target.value)}/>
                <Form.Label>Serial number</Form.Label>
                <Form.Control value={updatingSerialNumber} onChange={(event) => setUpdatingSerialNumber(event.target.value)} />
                <button style={{width:"100%"}} className='submit-button' onClick={() => sendCreateNewEquipmentRequest()}>button</button>
            </div>            
        </div>   
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default UpdateEquipment;