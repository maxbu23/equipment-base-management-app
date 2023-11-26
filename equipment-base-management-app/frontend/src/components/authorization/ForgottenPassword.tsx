import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Nav, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean; 
}

const ForgottenPassword = (props: Props) => {
    
    const [email, setEmail] = useState("");

    function sendRecoverPasswordRequest() {
      
          fetch('/api/v1/auth/recoverPassword',
            {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: email
            }
        )
        .then((response) =>{
            if (response.status === 200) {
                alert("Email with new password has been sent")
                clearState();
                props.onHide();
            } else {
                alert("Something went wrong!");
            }
        }).catch((message: string) => {
            alert(message);
        });
    }

    function clearState() {
        setEmail("");
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Recover password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form">
                    <div className="input-container">
                        <div className="input-container">
                            <label htmlFor='email'>Email: </label>
                            <input 
                                type='text' 
                                id='email' 
                                value={email} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="button" id="submit" type="button" onClick={() => sendRecoverPasswordRequest()}>Recover password</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
      );
}

export default ForgottenPassword;
