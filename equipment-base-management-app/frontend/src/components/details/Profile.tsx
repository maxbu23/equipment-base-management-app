import { useEffect, useState } from "react";
import { User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ChangePassword from "./ChangePassword";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
}

const Profile = (props: Props) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [user, setUser] = useLocalState("", "userData")

    const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);

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
                                {user.firstname}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Lastname: 
                            </th>
                            <th>
                                {user.lastname}
                            </th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                Email: 
                            </th>
                            <th>
                                {user.email}
                                
                            </th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                        
                        <tr>
                            <th>
                                <button className="button" onClick={() => setChangePasswordModalShow(true)}>Change password</button>
                            </th>
                            <th></th>
                        </tr>
                    </tbody>
                </Table>
            </div>          
        </div>   
          </Modal.Body>
            <ChangePassword 
                onHide={() => setChangePasswordModalShow(false)}
                show={changePasswordModalShow}
            />

        </Modal>
      );
}

export default Profile;
