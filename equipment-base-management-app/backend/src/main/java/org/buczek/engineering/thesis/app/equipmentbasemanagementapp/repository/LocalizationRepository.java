package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.repository;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.entity.Localization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalizationRepository extends JpaRepository<Localization, Long> {
}
