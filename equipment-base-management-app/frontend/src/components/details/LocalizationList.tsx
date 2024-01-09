import { Button, Col, Form, ListGroup, Modal, Row, Tab, Table } from "react-bootstrap";
import { Equipment, EquipmentType, Localization, User, UserAndEquipmentsIds } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipmentIdToAssign: Equipment;
    assignMode: boolean;
}

interface AssignEquipmentsRequest {
    userId: number;
    equipmentId: string;
    localizationId: string;
}

interface ChangeEquipmentLocalizationRequest {
    equipmentId: string;
    localizationId: string;
}

const LocalizationList = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [userId, setUserId] = useLocalState(-1, "id") 

    const [equipmentIdToAssign, setEquipmenIdToAssign] = useState<Equipment>(props.equipmentIdToAssign);

    // all available localizations
    const [localizations, setLocalizations] = useState<Localization[]>([]);

    // all users 
    const [users, setUsers] = useState<User[]>([]);

    const [selectedLocalizationId, setSelectedLocalizationId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<number>();
    
    useEffect(() => {
        setEquipmenIdToAssign(props.equipmentIdToAssign)
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
        if (props.assignMode) {
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
                    window.location.href = 'mobile-dashboard'
                }
            })
        } else {
            const request: ChangeEquipmentLocalizationRequest = createChangeLocalizationRequest();
            axios.put(
                `/api/v1/user/equipments/localization`,
                request,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json"
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    window.location.href = 'mobile-dashboard'
                }
            })
        }
        
    }

    function createAssignEquipmentsRequest() : AssignEquipmentsRequest {
        let request = {
            userId: userId as number,
            equipmentId: equipmentIdToAssign.id,
            localizationId: selectedLocalizationId
        }
        return request;
    } 

    function createChangeLocalizationRequest() : ChangeEquipmentLocalizationRequest {
        let request = {
            equipmentId: equipmentIdToAssign.id,
            localizationId: selectedLocalizationId
        }
        return request;
    } 

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {props.assignMode === true ? <>Assign Equipment</> : <>Change localization</>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div style={{paddingBottom: "10px"}}>
            <div className='registration-form-user'>
                <div>
                <Form.Label>Localization (department/building/room number) </Form.Label>
                    <select size={5} style={{height: "50px", width:"100%"}} onChange={(e) => setSelectedLocalizationId(e.target.value)}>
                        {localizations ? localizations.map((localization) => (
                            <option key={localization.id} value={localization.id}>{localization.department + " " + localization.building + " " + localization.roomNumber}</option>
                        )) : <></>}
                    </select>
                    <br/>
                </div>
            </div>            
        </div>   
        <div>                            
            <button className="button" onClick={() => sendAssignEquipmentRequest()}>
            {props.assignMode === true ? <>Assign</> : <>Change</>}
            </button>
        </div> 
        </Modal.Body>
        </Modal>
      );
}

export default LocalizationList;