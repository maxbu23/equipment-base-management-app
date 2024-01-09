import { useEffect, useState } from "react";
import { Equipment, Localization, User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faL } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosResponse } from "axios";
import LocalizationList from "./LocalizationList";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipment: Equipment; 
}

interface AssignEquipmentsRequest {
    userId: number;
    equipmentId: string;
    localizationId: string;
}

const EquipmentDetails = (props: Props) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [userId, setUserId] = useLocalState(-1, "id")

    const [currentEquipment, setCurrentEquipment] = useState(props.equipment)
    const [localizationListModalShow, setLocalizationListModalShow] = useState(false);
    const [assignMode, setAssignMode] = useState(false);

    useEffect(() => {
        setCurrentEquipment(props.equipment)
    }, [props])

    const setLocalizationList = (modalShow: boolean, aMode: boolean) => {
        setAssignMode(aMode);
        setLocalizationListModalShow(modalShow);
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Equipment details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <div className='registration-form-user'>
                <Table striped borderless size="sm">
                    <thead>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                Name: 
                            </th>
                            <th>
                                {currentEquipment? currentEquipment.name : ""}
                            </th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                Serial number: 
                            </th>
                            <th>
                                {currentEquipment? currentEquipment.serialNumber : ""}
                            </th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                Equipment type: 
                            </th>
                            <th>
                                {currentEquipment? currentEquipment.equipmentType : ""}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Owner: 
                            </th>
                            <th>
                                {currentEquipment?.owner?  currentEquipment.owner.email : ""}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Building: 
                            </th>
                            <th>
                                {currentEquipment?.localization? currentEquipment.localization.building : ""}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Floor: 
                            </th>
                            <th>
                                {currentEquipment?.localization? currentEquipment.localization.floor : ""}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Room number: 
                            </th>
                            <th>
                                {currentEquipment?.localization? currentEquipment.localization.roomNumber : ""}
                            </th>
                        </tr>
                    </tbody>
                </Table>
                {currentEquipment?.owner?.id === userId ? 
                <>
                    <button onClick={() => setLocalizationList(true, false)} className="button">Chnage localization</button>
                </>
                : 
                <></>
                }
                {currentEquipment?.owner === null ? 
                <>
                    <button onClick={() => setLocalizationList(true, true)} className="button">Assign to me</button>
                </>
                : 
                <></>
                }
            </div>            
        </div>   
        <LocalizationList
            show={localizationListModalShow}
            onHide={() => setLocalizationListModalShow(false)}
            equipmentIdToAssign={currentEquipment}
            assignMode={assignMode}
        />
          </Modal.Body>
        </Modal>
      );
}

export default EquipmentDetails;
