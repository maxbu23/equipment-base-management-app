import {useEffect, useState} from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button, Container, Form, Navbar } from 'react-bootstrap';
import useLocalState from "../util/useLocalStorage";
import { Equipment, User } from '../model/Models';

const RegistrationComponent = () => {
    
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [equipments, setEquipments] = useState(Array<Equipment>)
    const [equipmentIds, setEquipmentIds] = useState(Array<string>)

    useEffect(() => {
        axios.get<Equipment[]>(
            `/api/v1/admin/equipments/available`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            console.log(response.data)
            setEquipments(response.data)
        })
    }, [])

    function addEquipment(id: string) {
        if (equipmentIds.includes(id)) {
            const newEquipmentIds = equipmentIds.filter(_id => _id !== id);
            setEquipmentIds(newEquipmentIds)
        } else {
            setEquipmentIds(equipmentIds => [...equipmentIds, id])
        }
    }

    function sendCreateNewUserRequest() {
        const newUser: User = createNewUser()
        axios.post(
            `/api/v1/auth/register`,
            newUser,
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

    function createNewUser() : User {
        let newUser = {
            id: "",
            firstname: firstname,
            lastname: lastname,
            email: email,
            equipmentIds: equipmentIds
        }
        return newUser;
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
            <div className='registration-form-user'>
                <Form.Label>Firstname</Form.Label>
                <Form.Control onChange={(event) => setFirstname(event.target.value) }/>
                <Form.Label>Lastname</Form.Label>
                <Form.Control onChange={(event) => setLastname(event.target.value)}/>
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className='registration-form-equipments'>
                {/* {equipments.map(e => e.brand)} */}
                <Form>
                {equipments.map((equipment) => (
                    <div className="mb-3">
                        <Form.Check // prettier-ignore
                            id={equipment.id as unknown as string}
                            label={equipment.name}
                            onChange={(event) => addEquipment(event.target.id)}
                        />
                    </div>
                ))}
                </Form>
                <Button className='submit-button' onClick={() => sendCreateNewUserRequest()}>Add</Button>
            </div>
        </div>   
        )
}

export default RegistrationComponent;
