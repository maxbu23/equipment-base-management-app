import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Navbar } from 'react-bootstrap';
import useLocalState from "./../../util/useLocalStorage";
import { Equipment, EquipmentType } from './../../model/Models';

const ImportFile = () => {
    
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [file, setFile] = useState(null);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // Use a function to send the file to the Spring Boot backend
        sendFileToSpringBoot(file);
      };
    
      const sendFileToSpringBoot = async (file: any) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
      
          // Make a POST request to the Spring Boot endpoint
          const response = await axios.post('/api/v1/admin/import', 
          formData, 
          {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${jwt}`,
                Accept: "application/json"
            },
          });
      
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
    // function sendCreateNewEquipmentRequest() {
    //     const newEquipment: Equipment = createNewEquipment()
    //     axios.post(
    //         `/api/v1/admin/equipments`,
    //         newEquipment,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${jwt}`,
    //                 Accept: "application/json"
    //             }
    //         }
    //     ).then((response) => {
    //         if (response.status === 200) {
    //             window.location.href = 'admin-dashboard'
    //         }
    //     })
    // }

    // function createNewEquipment() : Equipment {
    //     let newEquipment = {
    //         id: "",
    //         name: name,
    //         brand: brand,
    //         serialNumber: serialNumber,
    //         equipmentType: equipmentType as EquipmentType
    //     }
    //     return newEquipment;
    // }

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
                    {/* <button className='button' onClick={() => null}>Import</button> */}
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload</button>
                </div>
            </div>            
            
        </div>   
        )
}

export default ImportFile;
