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
    const [table, setTable] = useState<JSX.Element>()
    const [profileModalShow, setProfileModalShow] = useState(false);

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
        setTable(<EquipmentList showAdminActions={false} showOwnerEmail={false} equipments={equipments} refreshData={() => {}}/>)
    }, [equipments])

    return(
        <div>
            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav>
                        <Nav.Link onClick={() => setProfileModalShow(true)}>Profile</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className="center-top">
                <div>
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

