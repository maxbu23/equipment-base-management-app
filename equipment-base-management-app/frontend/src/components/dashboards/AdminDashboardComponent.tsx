import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Equipment, EquipmentWithLocalization, User } from "../../model/Models";
import EquipmentList from "../lists/EquipmentList";
import UserList from "../lists/UserList";
import Profile from "../details/Profile";

const AdminDashboardComponent = () => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [equipments, setEquipments] = useState(Array<Equipment>)
    const [users, setUsers] = useState(Array<User>)
    const [table, setTable] = useState<JSX.Element>()
    const [profileModalShow, setProfileModalShow] = useState(false);


    useEffect(() => {
        fetchAndSetEquipments()
        fetchAndSetUsers()
    }, [])

    useEffect(() => {
        setTable(<EquipmentList equipments={equipments} isAdminDashboard={true} showChangeLocalization={false} refreshData={fetchAndSetEquipments}/>)
    }, [equipments])

    function fetchAndSetEquipments() {
        axios.get<Equipment[]>(
            '/api/v1/equipments',
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            setEquipments(response.data)
        })
        setTable(<EquipmentList equipments={equipments} isAdminDashboard={true} showChangeLocalization={false} refreshData={fetchAndSetEquipments}/>)
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

    

    const [file, setFile] = useState(null);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', "file");

        axios.post('http://localhost:8080/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            // Tutaj możesz obsłużyć odpowiedź z serwera
        }).catch(error => {
            // Obsługa błędów
        });
    };



    return(
        <div>
            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/registration-form">Add new user</Nav.Link>
                        <Nav.Link href="/add-new-equipment">Add new equipment</Nav.Link>
                        <Nav.Link href="/backup-import">Backup/Import</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setProfileModalShow(true)}>Profile</Nav.Link>
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
            {/* <input type="file" onChange={handleFileChange}></input>
            <button onClick={handleUpload}>UPLOAD</button> */}
            <Profile
                show={profileModalShow}
                onHide={() => setProfileModalShow(false)}
            />
        </div>
    );
}

export default AdminDashboardComponent;

