package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.model.enums.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private Long id;
    private String jwtToken;
    private Role role;
    private String firstname;
    private String lastname;
    private String email;
}
