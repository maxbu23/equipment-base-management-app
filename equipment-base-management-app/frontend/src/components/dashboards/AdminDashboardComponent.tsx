import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";
import { Container, ListGroup, ListGroupItem, Nav, Navbar, Table } from "react-bootstrap";
import { Equipment, User } from "../../model/Models";
import EquipmentList from "../lists/EquipmentList";
import UserList from "../lists/UserList";
import { Route, Routes } from "react-router-dom";
import RegistrationComponent from "../AddNewUserComponent";

const AdminDashboardComponent = () => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [equipments, setEquipments] = useState(Array<Equipment>)
    const [users, setUsers] = useState(Array<User>)
    const [table, setTable] = useState<JSX.Element>()

    useEffect(() => {
        fetchAndSetEquipments()
        fetchAndSetUsers()
    }, [])

    useEffect(() => {
        setTable(<EquipmentList equipments={equipments} refreshData={fetchAndSetEquipments}/>)
    }, [equipments])

    function fetchAndSetEquipments() {
        axios.get<Equipment[]>(
            '/api/v1/admin/equipments',
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            setEquipments(response.data)
        })
        setTable(<EquipmentList  equipments={equipments} refreshData={fetchAndSetEquipments}/>)
    } 

    function fetchAndSetUsers() {
        axios.get<User[]>(
            'api/v1/admin/users',
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<User[]>) => {
            setUsers(response.data)
        })
        setTable(<UserList users={users}/>)
    }

    return(
        <div>
            <Navbar className="set-to-left" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/registration-form">Add new user</Nav.Link>
                            <Nav.Link href="/add-new-equipment">Add new equipment</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
            <div className="center-top">
                <div>
                    <button onClick={() => fetchAndSetEquipments()}>Equipments</button>
                    <button onClick={() => fetchAndSetUsers()}>Users</button>
                </div>
                {table}
            </div>
        </div>
    );
}

export default AdminDashboardComponent;

