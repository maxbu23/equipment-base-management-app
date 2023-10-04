import React, { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Equipment, User } from "../../model/Models";
import EquipmentList from "../lists/EquipmentList";
import UserList from "../lists/UserList";

const UserDashboardComponent = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [id, setId] = useLocalState(-1, "id");
    const [equipments, setEquipments] = useState(Array<Equipment>)
    const [table, setTable] = useState<JSX.Element>()

    useEffect(() => {
        console.log("CALLING ")
        axios.get<Equipment[]>(
            `/api/v1/user/equipments/${id}`,
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

    useEffect(() => {
        setTable(<EquipmentList equipments={equipments}/>)
    }, [equipments])

    return(
        <div>
            <Navbar className="set-to-left" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
            <div className="center-top">
                <div>
                </div>
                {table}
            </div>
        </div>
    );
}

export default UserDashboardComponent;

