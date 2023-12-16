package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.service;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.EquipmentMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.LocalizationMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.mapper.UserMapper;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.dto.EquipmentDto;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Equipment;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentState;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.EquipmentType;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.request.AssignEquipmentRequest;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository.EquipmentRepository;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    private static final long EQUIPMENT_ID = 100L;
    private static final long USER_ID = 200L;
    private static final long LOCALIZATION_ID = 300L;

    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private UserService userService;
    @Mock
    private LocalizationService localizationService;

    @Mock(answer = Answers.CALLS_REAL_METHODS)
    private EquipmentMapper equipmentMapper;
    @Mock(answer = Answers.CALLS_REAL_METHODS)
    private UserMapper userMapper;

    @InjectMocks
    private EquipmentService tested;

    @Test
    void getAllEquipments_shouldReturnAllEquipmentsAsDTOs() {
        //when
        Equipment equipment = createCommonEquipmentEntityBuilder().build();
        when(equipmentRepository.findAll()).thenReturn(List.of(equipment));
        List<EquipmentDto> actual = tested.getAllEquipments();

        //then
        EquipmentDto expected = createCommonEquipmentDtoBuilder().build();
        assertThat(actual).containsOnly(expected);
    }

    @Test
    void givenIsUserId_getUserEquipments_shouldReturnUserEquipmentsAsDTOs() {
        //when
        Equipment equipment = createCommonEquipmentEntityBuilder().localization(null).build();
        when(equipmentRepository.findByOwnerId(USER_ID)).thenReturn(List.of(equipment));
        List<EquipmentDto> actual = tested.getEquipmentsByUserId(USER_ID);

        //then
        EquipmentDto expected = createCommonEquipmentDtoBuilder().build();
        assertThat(actual).containsOnly(expected);
    }

    @Test
    void givenEquipmentDto_updateEquipment_shouldSaveNewEntity() {
        //given
        EquipmentDto equipmentDto = createCommonEquipmentDtoBuilder().equipmentType(EquipmentType.LAPTOP).id(EQUIPMENT_ID).build();

        //when
        Equipment equipment = createCommonEquipmentEntityBuilder().build();
        when(equipmentRepository.findById(EQUIPMENT_ID)).thenReturn(Optional.of(equipment));
        tested.updateEquipment(equipmentDto);

        //then
        Equipment expected = createCommonEquipmentEntityBuilder().equipmentType(EquipmentType.LAPTOP).id(EQUIPMENT_ID).build();
        verify(equipmentRepository).save(expected);
    }

    @Test
    void givenAssigmentEquipmentRequest_assignEquipment_shouldSaveUpdatedEquipmentEntity() {
        //given
        AssignEquipmentRequest request = new AssignEquipmentRequest(USER_ID, EQUIPMENT_ID, LOCALIZATION_ID);

        //then
        Equipment equipment = createCommonEquipmentEntityBuilder().build();
        when(equipmentRepository.findById(EQUIPMENT_ID)).thenReturn(Optional.of(equipment));
        User user = User.builder()
                .id(USER_ID)
                .firstname("John")
                .lastname("Snow")
                .email("j.snow@example.com")
                .build();
        when(userService.findUserById(USER_ID)).thenReturn(user);
        Localization localization = Localization.builder()
                .id(LOCALIZATION_ID)
                .build();
        when(localizationService.findLocalizationById(LOCALIZATION_ID)).thenReturn(localization);
        tested.assignEquipment(request);

        //then
        equipment.setOwner(user);
        equipment.setLocalization(localization);
        verify(equipmentRepository).save(equipment);
    }

    private Equipment.EquipmentBuilder createCommonEquipmentEntityBuilder() {
        return Equipment.builder()
                .equipmentType(EquipmentType.PC)
                .name("PC workstation")
                .equipmentState(EquipmentState.NOT_ASSIGNED);
    }

    private EquipmentDto.EquipmentDtoBuilder createCommonEquipmentDtoBuilder() {
        return EquipmentDto.builder()
                .equipmentType(EquipmentType.PC)
                .name("PC workstation")
                .equipmentState(EquipmentState.NOT_ASSIGNED);
    }
}