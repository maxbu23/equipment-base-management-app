import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Profile from "../details/Profile";
import BarcodeScanner from "../BarcodeScanner";
import { Route, Routes } from "react-router";
import Scanner from "../Scanner";
import LoginComponent from "../LoginComponent";

const MobileComponent = () => {

    const [profileModalShow, setProfileModalShow] = useState(false);

    return(
        
        <>
            <Navbar data-bs-theme="dark">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/scanner">Scanner</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setProfileModalShow(true)}>Profile</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default MobileComponent;
