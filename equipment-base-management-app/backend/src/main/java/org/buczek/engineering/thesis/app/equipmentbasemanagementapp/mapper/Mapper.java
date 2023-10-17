package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper;

public interface Mapper<ENTITY, DTO> {

    ENTITY dtoToEntity(DTO dto);

    DTO entityToDto(ENTITY entity);
}
