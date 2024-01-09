import { Button, Col, Form, ListGroup, Modal, Row, Tab, Table } from "react-bootstrap";
import { Equipment, EquipmentType, Localization, User, UserAndEquipmentsIds } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipmentToAssign: Equipment;
}

interface AssignEquipmentsRequest {
    userId: number;
    equipmentId: string;
    localizationId: string;
}

const AssignEquipment = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt")

    const [equipmentToAssign, setEquipmentToAssign] = useState<Equipment>(props.equipmentToAssign);

    // all available localizations
    const [localizations, setLocalizations] = useState<Localization[]>([]);

    // all users 
    const [users, setUsers] = useState<User[]>([]);

    const [selectedLocalizationId, setSelectedLocalizationId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<number>();
    
    useEffect(() => {
        setEquipmentToAssign(props.equipmentToAssign)
        setSelectedLocalizationId("");
        setSelectedUserId(-1);
        fetchAndSetAllUsers();
        fetchAndSetAvailableLocalizations();
    }, [props])

    function fetchAndSetAllUsers() {
        axios.get<User[]>(
            `api/v1/admin/users`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<User[]>) => {
            setUsers(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    function fetchAndSetAvailableLocalizations() {
        axios.get<Localization[]>(
            `api/v1/localizations`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Localization[]>) => {
            setLocalizations(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    function sendAssignEquipmentRequest() {
        const request: AssignEquipmentsRequest = createAssignEquipmentsRequest();
        axios.put(
            `/api/v1/equipments/assign`,
            request,
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

    function createAssignEquipmentsRequest() : AssignEquipmentsRequest {
        let request = {
            userId: selectedUserId as number,
            equipmentId: equipmentToAssign.id,
            localizationId: selectedLocalizationId
        }
        return request;
    } 

    // function addEquipment(id: string) {
    //     if (equipmentIdsForAssign.includes(id)) {
    //         const newUpdatingEquipmentIds = equipmentIdsForAssign.filter(_id => _id != id);
    //         setEquipmentIdsForAssign(newUpdatingEquipmentIds)
    //     } else {
    //         setEquipmentIdsForAssign(equipmentIdsForAssign => [...equipmentIdsForAssign, id])
    //     }
    // }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Assign equipment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <div className='registration-form-user'>
                {/* <Form>
                    <Form.Label>Available equipments:</Form.Label>
                    {equipments ? equipments.map((equipment) => (
                        <div className="mb-3">
                            <tr><Form.Check
                                key={equipment.id}
                                id={equipment.id}
                                label={equipment.name}
                                onChange={(event) => addEquipment(event.target.id)}
                            />
                            </tr>
                        </div>
                    )): <></>}
                </Form> */}
                <div>
                    <Form.Label>Equipment: {equipmentToAssign.name} ({equipmentToAssign.serialNumber})</Form.Label>
                </div>
                <div>
                <Form.Label>User:</Form.Label>
                    <select size={5} style={{height: "300px", width:"100%"}}>
                        {users ? users.map((user) => (
                            <option onClick={() => setSelectedUserId(user.id as number)}>{user.firstname + " " + user.lastname + " (" + user.email + ")"}</option>
                        )) : <></>}
                    </select>
                </div>
                <div>
                <Form.Label>Localization (department / building / floor / classroom)</Form.Label>
                    <select size={5} style={{height: "300px", width:"100%"}}>
                        {localizations ? localizations.map((localization) => (
                            <option onClick={() => setSelectedLocalizationId(localization.id as string)}>{localization.department + " / " + localization.building + " / " + localization.floor + " / " + localization.roomNumber}</option>
                        )) : <></>}
                    </select>
                </div>
            </div>            
        </div>   
        <div>                   
            <button className="button" onClick={() => sendAssignEquipmentRequest()}>Assign</button>
        </div> 
        </Modal.Body>
        </Modal>
      );
}

export default AssignEquipment;