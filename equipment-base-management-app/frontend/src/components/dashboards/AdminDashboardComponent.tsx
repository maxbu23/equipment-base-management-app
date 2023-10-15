import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Equipment, User } from "../../model/Models";
import EquipmentList from "../lists/EquipmentList";
import UserList from "../lists/UserList";

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
        setTable(<EquipmentList showDelete={true} showUpdate={true} equipments={equipments} refreshData={fetchAndSetEquipments}/>)
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
        setTable(<EquipmentList showDelete={true} showUpdate={true} equipments={equipments} refreshData={fetchAndSetEquipments}/>)
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
        setTable(<UserList users={users} refreshData={fetchAndSetUsers}/>)
    }

    

    return(
        <div>
            <Navbar data-bs-theme="dark">
                <Container>
                        <Nav >
                            <Nav.Link href="/registration-form">Add new user</Nav.Link>
                            <Nav.Link  href="/add-new-equipment">Add new equipment</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
            <div className="center-top">
                <div>
                    <button className="button" onClick={() => fetchAndSetEquipments()}>Equipments</button>
                    <button className="button" onClick={() => fetchAndSetUsers()}>Users</button>
                </div>
                {table}
            </div>
        </div>
    );
}

export default AdminDashboardComponent;

