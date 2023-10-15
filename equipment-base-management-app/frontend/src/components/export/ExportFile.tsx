import { Button, Form, Modal } from "react-bootstrap";
import { Equipment, EquipmentType } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
}

const ExportFile = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [filename, setFilename] = useState("Equipments_" + Math.floor(new Date().getTime() / 1000).toString());

    function downloadFile() {
      axios({
        url: '/api/v1/admin/export/equipments',
        method: 'GET',
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const now = Math.floor(new Date().getTime() / 1000);
        link.setAttribute('download', `${filename}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
      props.onHide();
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Export to .xlsx file 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
            <Form.Label>File name</Form.Label>
            <Form.Control value={filename} onChange={(e) => setFilename(e.target.value)}></Form.Control>
            <Button style={{marginTop: "10px"}} className="button" onClick={() => downloadFile()}>Export</Button>
            </div>
          </Modal.Body>
        </Modal>
      );
}

export default ExportFile;