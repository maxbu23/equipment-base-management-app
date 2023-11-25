package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.controller.export;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.export.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/admin")
@CrossOrigin(value = "*")
@Slf4j
public class ExportController {

    private final ExportService exportService;
    private final EquipmentService equipmentService;

    @GetMapping("/export/equipments")
    public ResponseEntity<byte[]> exportXlsxFile() throws IOException {
        byte[] generatedFileInBytes = exportService.generateFile();
        return new ResponseEntity<>(
                generatedFileInBytes,
                generateHeadersWithContent(generatedFileInBytes),
                HttpStatus.OK
        );
    }

    private HttpHeaders generateHeadersWithContent(byte[] generatedFileInBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "equipments.xlsx");
        headers.setContentLength(generatedFileInBytes.length);

        return headers;
    }
}
