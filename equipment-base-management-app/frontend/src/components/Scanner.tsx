import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Nav, Navbar, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useLocalState from "../util/useLocalStorage";
import ChangePassword from "./details/ChangePassword";
import BarcodeScanner from "./BarcodeScanner";

const Scanner = () => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [user, setUser] = useLocalState("", "userData")

    const [barcode, setBarcode] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    function handleBarcodeDetected(barcode: string) {
        setBarcode(barcode);
        setIsScanning(false);
        console.log(`Detected barcode: ${barcode}`);
    };

    function getEquipmentByBarcode() {
        alert("Barcode: " + barcode);
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
                                            <Nav.Link onClick={() => getEquipmentByBarcode()}>Get equipment info</Nav.Link>
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
                        return barcode === "" ? <></> : <div className='creating-form'><p style={{textAlign:"center"}}>Last Scanne Barcode: {barcode}</p></div>
                    } else {
                        return (
                            <BarcodeScanner onDetected={handleBarcodeDetected} />
                        )
                    }
                })()
                }   
        </div>
        </div>
      );
}

export default Scanner;
