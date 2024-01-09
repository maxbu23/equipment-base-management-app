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
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Array;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class XLSXReader {

    private final ResourceLoader resourceLoader;

    @Value("${application.initData.localizationsFileName}")
    private String localizationsFile;
//    @Value("${application.initData.equipmentsFileName}")
    private String equipmentsFile = "Inventory.xlsx";

    public List<LocalizationDto> readLocationsFromXLSXFile() throws IOException {
        Sheet sheet = prepareWoorkbookSheet(localizationsFile);
        List<LocalizationDto> localizations = new ArrayList<>();
        int i = 0;
        for (Row row : sheet) {
            if (i++ <= 20) {
                continue;
            }
            localizations.add(mapRowToLocalizationDtoObject(row));
        }
        return localizations;
    }

    public List<Localization> readLocationsFromXLSXFile(MultipartFile file) throws IOException {
        Sheet sheet = prepareWoorkbookSheet(file);
        ArrayList<Localization> localizations = new ArrayList<>();
        for (Row row : sheet) {
            localizations.add(mapRowToLocalizationObject(row));
        }

        return localizations;
    }

    public List<Equipment> readEquipmentsFromXLSXFile(MultipartFile file) throws IOException {
        Sheet sheet = prepareWoorkbookSheet(file);
        ArrayList<Equipment> equipments = new ArrayList<>();
        int i = 0;
        for (Row row : sheet) {
            if (i++ < 2) {
                continue;
            }
            equipments.add(mapRowToEquipmentObject(row));
        }

        return equipments;
    }

    public List<Equipment> readEquipmentsFromXLSXFile() throws IOException {
        Sheet sheet = prepareWoorkbookSheet(equipmentsFile);
        ArrayList<Equipment> equipments = new ArrayList<>();
        int i = 0;
        for (Row row : sheet) {
            if (i++ < 2) {
                continue;
            }
            Equipment equipment = mapRowToEquipmentObject(row);
            equipment.setEquipmentState(EquipmentState.NOT_ASSIGNED);
            equipments.add(equipment);
        }

        return equipments;
    }

//    public List<EquipmentDto> readEquipmentsFromXLSXFile() throws IOException {
//        Sheet sheet = prepareWoorkbookSheet(equipmentsFile);
//        List<EquipmentDto> equipments = new ArrayList<>();
//        for (Row row : sheet) {
//            equipments.add(mapRowToEquipmentObject(row));
//        }
//        return equipments;
//    }
    private Sheet prepareWoorkbookSheet(String filename) throws IOException {
        FileInputStream fileInputStream = generateFileInputStream(filename);
        Workbook workbook = new XSSFWorkbook(fileInputStream);
        return workbook.getSheetAt(0);
    }

    private Sheet prepareWoorkbookSheet(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        return workbook.getSheetAt(0);
    }

    private FileInputStream generateFileInputStream(String filename) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:" + filename);
        File file = resource.getFile();
        return new FileInputStream(file);
    }

    private LocalizationDto mapRowToLocalizationDtoObject(Row row) {
        return LocalizationDto.builder()
                .department(row.getCell(0).getStringCellValue())
                .building(row.getCell(1).getStringCellValue())
                .floor((int) row.getCell(2).getNumericCellValue())
                .roomNumber((int) row.getCell(3).getNumericCellValue())
                .build();
    }

    private Localization mapRowToLocalizationObject(Row row) {
        return Localization.builder()
                .department(row.getCell(0).getStringCellValue())
                .building(row.getCell(1).getStringCellValue())
                .floor((int) row.getCell(2).getNumericCellValue())
                .roomNumber((int) row.getCell(3).getNumericCellValue())
                .build();
    }

    private Equipment mapRowToEquipmentObject(Row row) {
//        return EquipmentDto.builder()
//                .equipmentType(EquipmentType.valueOf(row.getCell(0).getStringCellValue()))
//                .name(row.getCell(1).getStringCellValue())
//                .brand(row.getCell(2).getStringCellValue())
//                .serialNumber(row.getCell(3).getStringCellValue())
//                .equipmentState(EquipmentState.NOT_ASSIGNED)
//                .build();
        String date = row.getCell(5).getStringCellValue();
        String year;
        String month;
        String day;
        Equipment.EquipmentBuilder equipmentBuilder = Equipment.builder();
        if (!date.isEmpty()) {
            year = date.substring(0, 4);
            month = date.substring(5, 7);
            day = date.substring(8, 10);
            equipmentBuilder.boughtDate(LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), Integer.parseInt(day)));
        }
        return equipmentBuilder
                .name(row.getCell(1).getStringCellValue())
                .inventoryNumber(row.getCell(2).getStringCellValue())
                .equipmentType(EquipmentType.fromValue(row.getCell(3).getStringCellValue()))
                .value(BigDecimal.valueOf(row.getCell(4).getNumericCellValue()))
                .barcode(row.getCell(6).getStringCellValue())
                .serialNumber(row.getCell(8).getStringCellValue())
//                .elements(row.getCell(9).getStringCellValue())
                .build();

        //1 -> name
        //2 -> nr inwentarzowy
        //3 -> typ
        //4 -> wartosc poczatkowa
        //5 -> data nabycia
        //6 -> kod kreskowy
        //7 -> miejsce uzytkowania pewlna galaz
        //8 -> numer seryjny
        //9 -> elementy skladowe
    }
}
