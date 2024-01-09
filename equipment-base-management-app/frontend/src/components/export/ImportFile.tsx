import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Navbar } from 'react-bootstrap';
import useLocalState from "./../../util/useLocalStorage";

const ImportFile = () => {
    
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [equipmentsFile, setEquiupmentsFile] = useState(null);
    const [equipmentsForce, setEquipmentsForce] = useState(false);
    const [localizationsFile, setLocalizationsFile] = useState(null);
    const [localizationsForce, setLocalizationsForce] = useState(false);

    const handleEquipmentsFileChange = (event: any) => {
        alert(event.target.files[0].name);
        setEquiupmentsFile(event.target.files[0]);
    };

    const handleEquipmentsUpload = () => {
        alert(equipmentsFile);
        sendEquipmentsFile(equipmentsFile);
    };
    
    const handleLocalizationsFileChange = (event: any) => {
      setLocalizationsFile(event.target.files[0]);
    };

    const handleLocalizationsUpload = () => {
      sendLocalizationsFile(equipmentsFile);
    };

    const sendEquipmentsFile = async (file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      axios.post(`/api/v1/admin/import/equipments?force=${equipmentsForce}`,
      formData, 
      {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json"
        },
      }).then((response) => {
        if (response.status === 200) {
          window.location.href = 'admin-dashboard'
      }
      }).catch((error) => {
        console.error('Error uploading file:', error);
        alert("Something went wrong. Please try again later.")
        window.location.href = 'admin-dashboard'
        });
    };

    const sendLocalizationsFile = async (file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      axios.post(`/api/v1/admin/import/localizations?force=${localizationsForce}`,
      formData, 
      {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json"
        },
      }).then((response) => {
        if (response.status === 200) {
          window.location.href = 'admin-dashboard'
      }
      }).catch((error) => {
        console.error('Error uploading file:', error);
        alert("Something went wrong. Please try again later.")
        window.location.href = 'admin-dashboard'
        });
    };

    return(
        <div> 
            <div>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand href="/admin-dashboard">Back</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <div className='creating-form'>
                <div style={{padding: "10px"}}>
                  <Form.Group controlId="formFile">
                    <Form.Label>Upload equipments</Form.Label>
                    <div style={{display: "flex"}}>
                    <Form.Control onChange={handleEquipmentsFileChange} type="file" style={{marginBottom: "10px"}}/>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Force"
                      style={{marginLeft: "10px"}}
                      onChange={() => setEquipmentsForce(!equipmentsForce)}
                    />
                    </div>
                  </Form.Group>
                <button className="button" onClick={handleEquipmentsUpload}>Upload</button>
                </div>
            </div>  
            <div className='creating-form'>
                <div style={{padding: "10px"}}>
                  <Form.Group controlId="formFile">
                    <Form.Label>Upload localizations</Form.Label>
                    <div style={{display: "flex"}}>
                    <Form.Control onChange={handleLocalizationsFileChange} type="file" style={{marginBottom: "10px"}}/>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Force"
                      style={{marginLeft: "10px"}}
                      onChange={() => setLocalizationsForce(!localizationsForce)}
                    />
                    </div>
                  </Form.Group>
                <button className="button" onClick={handleLocalizationsUpload}>Upload</button>
                </div>
            </div>  
            <div className='creating-form'>
                <div style={{padding: "10px"}}>
                  <Form.Group controlId="formFile">
                    <Form.Label>Create backup</Form.Label>
                    <div style={{display: "flex"}}>
                    <Form.Control onChange={handleLocalizationsFileChange} type="file" style={{marginBottom: "10px"}}/>
                    
                    </div>
                  </Form.Group>
                <button className="button" onClick={handleLocalizationsUpload}>Upload</button>
                </div>
            </div> 
            <div className='creating-form'>
                <div style={{padding: "10px"}}>
                  <Form.Group controlId="formFile">
                    <Form.Label>Import backup</Form.Label>
                    <div style={{display: "flex"}}>
                    <Form.Control onChange={handleLocalizationsFileChange} type="file" style={{marginBottom: "10px"}}/>
                    </div>
                  </Form.Group>
                <button className="button" onClick={handleLocalizationsUpload}>Upload</button>
                </div>
            </div>            
            
        </div>   
        )
}

export default ImportFile;
