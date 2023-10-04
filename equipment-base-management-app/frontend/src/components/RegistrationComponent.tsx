import React, {ChangeEvent, useEffect, useState} from 'react';
import ReactDOM  from 'react-dom';
import axios, { AxiosResponse } from 'axios';
import { Container, Form, Nav, Navbar } from 'react-bootstrap';
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
        console.log("CALLING ")
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



    // submit = (event: any) => {
    //     event.preventDefault()
    //     const url = "http://localhost:8080/api/v1/users"
    //     alert("Sending: \n Firstname: " + this.state.firstName + "\n Lastname: " + this.state.lastName + "\n Email: " + this.state.email + "\n Password: " + this.state.password)
    //     axios.post(url, this.state)
    // }

    function addEquipment(id: string) {
        if (equipmentIds.includes(id)) {
            const newEquipmentIds = equipmentIds.filter(_id => _id !== id);
            setEquipmentIds(newEquipmentIds)
        } else {
            setEquipmentIds(equipmentIds => [...equipmentIds, id])
        }
    }

    // interface User {
    //     firstname: string;
    //     lastname: string;
    //     email: string;
    //     equipmentIds: string[];
    // }

    function sendCreateNewUserRequest() {
        const newUser: User = createNewUser()
        console.log("New user: " + newUser)
        axios.post(
            `/api/v1/admin/users`,
            newUser,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((status) => {
            console.log(status)
        })
    }

    function createNewUser() : User {
        let newUser = {
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
            </div>
            <button onClick={() => sendCreateNewUserRequest()}>button</button>
        </div>   
        )
}

export default RegistrationComponent;

function delay(arg0: number) {
    throw new Error('Function not implemented.');
}
