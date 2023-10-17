package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.utils;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.LocalizationDto;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class XLSXReader {

    private final ResourceLoader resourceLoader;

    public List<LocalizationDto> readLocationsFromXLSXFile() throws IOException {
        Sheet sheet = prepareWoorkbookSheet();
        List<LocalizationDto> localizations = new ArrayList<>();
        for (Row row : sheet) {
            localizations.add(mapRowToLocalizationObject(row));
        }
        return localizations;
    }

    private Sheet prepareWoorkbookSheet() throws IOException {
        FileInputStream fileInputStream = generateFileInputStream();
        Workbook workbook = new XSSFWorkbook(fileInputStream);
        return workbook.getSheetAt(0);
    }

    private FileInputStream generateFileInputStream() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:localizations.xlsx");
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
}
