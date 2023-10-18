package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class XLSXReader {

    private final ResourceLoader resourceLoader;

    @Value("${application.initData.localizationsFileName}")
    private String localizationsFile;
    @Value("${application.initData.equipmentsFileName}")
    private String equipmentsFile;

    public List<LocalizationDto> readLocationsFromXLSXFile() throws IOException {
        Sheet sheet = prepareWoorkbookSheet(localizationsFile);
        List<LocalizationDto> localizations = new ArrayList<>();
        for (Row row : sheet) {
            localizations.add(mapRowToLocalizationObject(row));
        }
        return localizations;
    }

    public List<EquipmentDto> readEquipmentsFromXLSXFile() throws IOException {
        Sheet sheet = prepareWoorkbookSheet(equipmentsFile);
        List<EquipmentDto> equipments = new ArrayList<>();
        for (Row row : sheet) {
            equipments.add(mapRowToEquipmentObject(row));
        }
        return equipments;
    }
    private Sheet prepareWoorkbookSheet(String filename) throws IOException {
        FileInputStream fileInputStream = generateFileInputStream(filename);
        Workbook workbook = new XSSFWorkbook(fileInputStream);
        return workbook.getSheetAt(0);
    }

    private FileInputStream generateFileInputStream(String filename) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:" + filename);
        File file = resource.getFile();
        return new FileInputStream(file);
    }

    private LocalizationDto mapRowToLocalizationObject(Row row) {
        return LocalizationDto.builder()
                .department(row.getCell(0).getStringCellValue())
                .building(row.getCell(1).getStringCellValue())
                .floor((int) row.getCell(2).getNumericCellValue())
                .roomNumber((int) row.getCell(3).getNumericCellValue())
                .build();
    }

    private EquipmentDto mapRowToEquipmentObject(Row row) {
        return EquipmentDto.builder()
                .equipmentType(EquipmentType.valueOf(row.getCell(0).getStringCellValue()))
                .name(row.getCell(1).getStringCellValue())
                .brand(row.getCell(2).getStringCellValue())
                .serialNumber(row.getCell(3).getStringCellValue())
                .equipmentState(EquipmentState.NOT_ASSIGNED)
                .build();
    }
}
