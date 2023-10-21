import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Navbar } from 'react-bootstrap';
import useLocalState from "../util/useLocalStorage";
import { Equipment, EquipmentType } from '../model/Models';

const AddNewUserComponent = () => {
    
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [brand, setBrand] = useState("");
    const [equipmentType, setEquipmentType] = useState("");
    const [name, setName] = useState("");
    const [serialNumber, setSerialNumber] = useState("")

    function sendCreateNewEquipmentRequest() {
        const newEquipment: Equipment = createNewEquipment()
        axios.post(
            `/api/v1/admin/equipments`,
            newEquipment,
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

    function createNewEquipment() : Equipment {
        let newEquipment = {
            id: "",
            name: name,
            brand: brand,
            serialNumber: serialNumber,
            equipmentType: equipmentType as EquipmentType
        }
        return newEquipment;
    }

    return(
        <div> 
            <div>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand href="/admin-dashboard">Back</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <div className='creating-form'>
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(event) => setName(event.target.value) }/>
                <Form.Label>Equipment type</Form.Label>
                <Form.Select aria-label="Default select example" onChange={(event) => setEquipmentType(event.target.value)}>
                    <option color="red" value="">Select equipment type</option>
                    {Object.values(EquipmentType).map((type) => (
                        <option value={type.toUpperCase()}>{type.toUpperCase()}</option>
                    ))}
                </Form.Select>
                <Form.Label>Brand</Form.Label>
                <Form.Control onChange={(event) => setBrand(event.target.value)}/>
                <Form.Label>Serial number</Form.Label>
                <Form.Control onChange={(event) => setSerialNumber(event.target.value)} />
                <div style={{padding: "10px"}}>
                    <button className='button' onClick={() => sendCreateNewEquipmentRequest()}>Add</button>
                </div>
            </div>            
            
        </div>   
        )
}

export default AddNewUserComponent;
