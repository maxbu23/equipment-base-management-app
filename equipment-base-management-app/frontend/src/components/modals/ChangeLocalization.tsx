import { Button, Col, Form, ListGroup, Modal, Row, Tab, Table } from "react-bootstrap";
import { Equipment, EquipmentType, Localization, User, UserAndEquipmentsIds } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipment: Equipment; 
}

interface ChangeLocalizationRequest {
    equipmentId: string;
    localizationId: string;
}

const ChangeLocalization = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt")

    const [equipmentToLocalizationChange, setEquipmentToLocalizationChange] = useState<Equipment>(props.equipment);
    const [localizations, setLocalizations] = useState<Localization[]>([]);
    const [selectedLocalizationId, setSelectedLocalizationId] = useState<string>("");
    
    useEffect(() => {
        setEquipmentToLocalizationChange(props.equipment)
        setSelectedLocalizationId("");
        fetchAndSetAvailableLocalizations();
    }, [props])


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

    function sendChangeLocalizationRequest() {
        const request: ChangeLocalizationRequest = createChangeLocalizationRequest();
        alert(request.equipmentId + " " + request.localizationId)
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
                window.location.href = 'user-dashboard'
            }
        })
    }

    function createChangeLocalizationRequest() : ChangeLocalizationRequest {
        let request = {
            equipmentId: equipmentToLocalizationChange.id,
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
                Change localization
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <div className='registration-form-user'>
                <div>
                <Form.Label>Localization: {selectedLocalizationId}</Form.Label>
                    <select size={5} style={{height: "300px", width:"100%"}}>
                        {localizations ? localizations.map((localization) => (
                            <option onClick={() => setSelectedLocalizationId(localization.id as string)}>{localization.department + " " + localization.building + " " + localization.roomNumber}</option>
                        )) : <></>}
                    </select>
                </div>
            </div>            
        </div>   
        <div style={{marginTop: "10px"}}>                
            <button className="button" onClick={() => sendChangeLocalizationRequest()}>Change localization</button>
        </div> 
        </Modal.Body>
        </Modal>
      );
}

export default ChangeLocalization;