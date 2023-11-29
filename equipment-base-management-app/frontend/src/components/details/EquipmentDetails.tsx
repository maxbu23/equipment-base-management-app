import { useEffect, useState } from "react";
import { Equipment, User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    equipment: Equipment; 
}

const EquipmentDetails = (props: Props) => {
    const [jwt, setJwt] = useLocalState("", "jwt")

    const [currentEquipment, setCurrentEquipment] = useState(props.equipment)

    useEffect(() => {
        setCurrentEquipment(props.equipment)
    }, [props])

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
            </div>            
        </div>   
          </Modal.Body>
        </Modal>
      );
}

export default EquipmentDetails;
