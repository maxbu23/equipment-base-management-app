package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.export;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.EquipmentService;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class ExportService {

    private final EquipmentService equipmentService;

    public byte[] generateFile() throws IOException {
        log.info("Generating xlsx file...");

        List<EquipmentDto> equipments = equipmentService.getAllEquipments();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Equipments");

        generateHeader(sheet);

        int rowIndex = 1;
        for (EquipmentDto equipment : equipments) {
            generateContentRow(sheet, equipment, rowIndex++);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        return outputStream.toByteArray();
    }

    private void generateHeader(Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("#");
        headerRow.createCell(1).setCellValue("TYPE");
        headerRow.createCell(2).setCellValue("NAME");
        headerRow.createCell(3).setCellValue("BRAND");
        headerRow.createCell(4).setCellValue("SERIAL NUMBER");
    }

    private void generateContentRow(Sheet sheet, EquipmentDto equipment, int rowIndex) {
        Row dataRow = sheet.createRow(rowIndex);
        dataRow.createCell(0).setCellValue(rowIndex);
        dataRow.createCell(1).setCellValue(equipment.equipmentType().name());
        dataRow.createCell(2).setCellValue(equipment.name());
        dataRow.createCell(3).setCellValue(equipment.brand());
        dataRow.createCell(4).setCellValue(equipment.serialNumber());
    }
 }
