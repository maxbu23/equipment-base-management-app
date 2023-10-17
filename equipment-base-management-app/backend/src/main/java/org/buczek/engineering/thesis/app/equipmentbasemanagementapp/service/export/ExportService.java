package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service.export;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentWithLocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
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

        List<EquipmentWithLocalizationDto> equipments = equipmentService.getAllEquipments();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Equipments");

        generateHeader(sheet);

        int rowIndex = 1;
        for (EquipmentWithLocalizationDto equipmentWithLocalizationDto : equipments) {
            generateContentRow(sheet, equipmentWithLocalizationDto, rowIndex++);
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
        headerRow.createCell(5).setCellValue("DEPARTMENT");
        headerRow.createCell(6).setCellValue("BUILDING");
        headerRow.createCell(7).setCellValue("FLOOR");
        headerRow.createCell(8).setCellValue("ROOM NUMBER");
    }

    private void generateContentRow(Sheet sheet, EquipmentWithLocalizationDto equipmentWithLocalizationDto, int rowIndex) {
        Row dataRow = sheet.createRow(rowIndex);

        EquipmentDto equipment = equipmentWithLocalizationDto.equipment();
        LocalizationDto localization = equipmentWithLocalizationDto.localization();

        dataRow.createCell(0).setCellValue(rowIndex);
        dataRow.createCell(1).setCellValue(equipment.equipmentType().name());
        dataRow.createCell(2).setCellValue(equipment.name());
        dataRow.createCell(3).setCellValue(equipment.brand());
        dataRow.createCell(4).setCellValue(equipment.serialNumber());
        if (localization != null) {
            dataRow.createCell(5).setCellValue(localization.department());
            dataRow.createCell(6).setCellValue(localization.building());
            dataRow.createCell(7).setCellValue(localization.floor());
            dataRow.createCell(8).setCellValue(localization.roomNumber());
        } else {
            dataRow.createCell(5).setCellValue("");
            dataRow.createCell(6).setCellValue("");
            dataRow.createCell(7).setCellValue("");
            dataRow.createCell(8).setCellValue("");
        }

    }
 }
