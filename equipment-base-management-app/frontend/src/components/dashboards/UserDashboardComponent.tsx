import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Equipment, EquipmentWithLocalization } from "../../model/Models";
import EquipmentList from "../lists/EquipmentList";
import Profile from "../details/Profile";

const UserDashboardComponent = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [id, setId] = useLocalState(-1, "id");
    const [equipments, setEquipments] = useState(Array<Equipment>)
    const [allEquipments, setAllEquipments] = useState(Array<Equipment>)
    const [table, setTable] = useState<JSX.Element>()
    const [profileModalShow, setProfileModalShow] = useState(false);
    
    useEffect(() => {
        fetchAndSetUserEquipments();
    }, [])

    function fetchAndSetUserEquipments() {
        axios.get<Equipment[]>(
            `/api/v1/user/equipments/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            setEquipments(response.data)
        })
    }

    useEffect(() => {
        setTable(<EquipmentList equipments={equipments} isAdminDashboard={false} showChangeLocalization={true} refreshData={fetchAndSetUserEquipments}/>)
    }, [equipments])

    function fetchAndSetAllEquipments() {
        axios.get<Equipment[]>(
            '/api/v1/equipments',
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            setAllEquipments(response.data)
        })
        setTable(<EquipmentList equipments={allEquipments} isAdminDashboard={false} showChangeLocalization={false} refreshData={fetchAndSetAllEquipments}/>)
    } 

    return(
        <div>
            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav className="ms-auto">
                        <Nav.Link onClick={() => setProfileModalShow(true)}>Profile</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className="center-top">
            <div>
                    <button className="button" onClick={() => fetchAndSetUserEquipments()}>My equipments</button>
                    <button className="button" onClick={() => fetchAndSetAllEquipments()}>All equipments</button>
                </div>
                {table}
            </div>
            <Profile
                show={profileModalShow}
                onHide={() => setProfileModalShow(false)}
            />
        </div>
    );
}

export default UserDashboardComponent;

