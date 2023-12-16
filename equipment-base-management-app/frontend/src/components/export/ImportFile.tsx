import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Navbar } from 'react-bootstrap';
import useLocalState from "./../../util/useLocalStorage";

const ImportFile = () => {
    
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [file, setFile] = useState(null);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        sendFileToServer(file);
      };
    
    const sendFileToServer = async (file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      axios.post('/api/v1/admin/import', 
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
                    <Form.Label>Upload</Form.Label>
                    <div style={{display: "flex"}}>
                    <Form.Control onChange={handleFileChange} type="file" style={{marginBottom: "10px"}}/>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Force"
                      style={{marginLeft: "10px"}}
                    />
                    </div>
                  </Form.Group>
                <button className="button" onClick={handleUpload}>Upload</button>
                </div>
            </div>            
            
        </div>   
        )
}

export default ImportFile;
