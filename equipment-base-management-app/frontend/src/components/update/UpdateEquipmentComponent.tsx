import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import { Equipment, EquipmentType } from "../../model/Models";
import { Form } from "react-bootstrap";
import axios from "axios";

const UpdateEquipmentComponent = () => {

    const params = new URLSearchParams(window.location.search);
    const encodedEquipment = params.get('data');
    const equipment : Equipment = JSON.parse(atob(encodedEquipment as string));
    
    const [jwt, setJwt] = useLocalState("", "jwt")

    const [updatingId, setUpdatingId] = useState(equipment.id)
    const [updatingName, setUpdatingName] = useState(equipment.name);
    const [updatingBrand, setUpdatingBrand] = useState(equipment.brand);
    const [updatingSerialNumber, setUpdatingSerialNumber] = useState(equipment.serialNumber)
    const [updatingType, setUpdatingType] = useState(equipment.equipmentType.toString())

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

    return(
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
        )
}

export default UpdateEquipmentComponent;