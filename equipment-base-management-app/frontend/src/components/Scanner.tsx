import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Nav, Navbar, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faL } from '@fortawesome/free-solid-svg-icons';
import useLocalState from "../util/useLocalStorage";
import ChangePassword from "./details/ChangePassword";
import BarcodeScanner from "./BarcodeScanner";
import axios, { AxiosResponse } from "axios";
import { Equipment } from "../model/Models";
import EquipmentDetails from "./details/EquipmentDetails";

const Scanner = () => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [user, setUser] = useLocalState("", "userData")

    const [barcode, setBarcode] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const [equipmentDetailsModalShow, setEquipmentDetailModalShow] = useState(false);
    const [currentEquipment, setCurrentEquipment] = useState<Equipment>();

    function handleBarcodeDetected(barcode: string) {
        setBarcode(barcode);
        setIsScanning(false);
        console.log(`Detected barcode: ${barcode}`);
    };

    function sendGetEquipmentByBarcodeRequest() {
        axios.get<Equipment>(
            `api/v1/user/equipments/barcodes/${barcode}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment>) => {
            setCurrentEquipment(response.data);
            setEquipmentDetailModalShow(true);
        }).catch((error) => {
            console.log(error)
        })
    }

    function turnOffScanner() {
        setEquipmentDetailModalShow(false);
        setIsScanning(false);
        setBarcode("");
    }

    return (
        <div>
            <div>
                <Navbar data-bs-theme="dark">
                    <Container>
                            {(() => {
                                if (!isScanning && barcode === "") {
                                return (
                                    <Nav>
                                        <Nav.Link onClick={() => setIsScanning(true)}>Start scanning</Nav.Link>
                                    </Nav>
                                )
                                } else if(!isScanning && barcode !== "") {
                                return (
                                    <div>
                                        <Nav>
                                            <Nav.Link onClick={() => setIsScanning(true)}>Scan again</Nav.Link>
                                            <Nav.Link onClick={() => sendGetEquipmentByBarcodeRequest()}>Get equipment info</Nav.Link>
                                        </Nav> 
                                    </div>
                                )
                                } else {
                                    return <div></div>
                                }
                            })()}
                    </Container>
                </Navbar>
            </div>
            <div>
                {(() => {
                    if (!isScanning) {
                        return barcode === "" ? <></> : <div className='creating-form'><p style={{textAlign:"center"}}>Barcode: {barcode}</p></div>
                    } else {
                        return (
                            <div >
                                <div>
                                    <BarcodeScanner onDetected={handleBarcodeDetected} />
                                </div>
                            </div>
                            
                        )
                    }
                })()
                }   
        </div>
        <EquipmentDetails
            show={equipmentDetailsModalShow}
            onHide={() => turnOffScanner()}
            equipment={currentEquipment}
        />
        </div>
      );
}

export default Scanner;
