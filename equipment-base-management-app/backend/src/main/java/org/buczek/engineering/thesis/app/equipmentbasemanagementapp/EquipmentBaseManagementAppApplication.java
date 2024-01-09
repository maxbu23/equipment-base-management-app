package org.buczek.engineering.thesis.app.equipmentbasemanagementapp;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Web API", version = "1.0"))
public class EquipmentBaseManagementAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquipmentBaseManagementAppApplication.class, args);
    }

}
