import { useEffect, useState } from "react";
import { User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    user: User; 
}

const UserDetails = (props: Props) => {
    const [jwt, setJwt] = useLocalState("", "jwt")

    const [currentUser, setCurrentUser] = useState(props.user)

    // in case user to update was sent later
    useEffect(() => {
        setCurrentUser(props.user)
    }, [props])

    function sendEmail() {
        window.location.href = `mailto:${currentUser.email}`;
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              User details
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
                                Firstname: 
                            </th>
                            <th>
                                {currentUser? currentUser.firstname : ""}
                            </th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                Lastname: 
                            </th>
                            <th>
                                {currentUser? currentUser.lastname : ""}
                            </th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                Email: 
                            </th>
                            <th>
                                {currentUser? currentUser.email : ""}
                                
                            </th>
                            <th onClick={() => sendEmail()}>
                                <button onClick={() => sendEmail()}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </button>
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

export default UserDetails;
