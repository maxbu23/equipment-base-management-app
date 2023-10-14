package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config;

import lombok.RequiredArgsConstructor;
import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import static org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role.ADMIN;
import static org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.model.Role.USER;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;


@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(
//                        request -> request
//                                .requestMatchers(antMatcher("/api/v1/auth/**"))
//                                .permitAll()
//                                .anyRequest()
//                                .authenticated()
//                )
//                .sessionManagement(
//                        config -> config
//                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

//        httpSecurity
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests()
//                .requestMatchers(antMatcher("/api/v1/auth/**"), antMatcher("/h2-console.html"))
//                .permitAll()
//                .anyRequest()
//                .authenticated()
//                .and()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry ->
                        authorizationManagerRequestMatcherRegistry
//                                .requestMatchers(AntPathRequestMatcher.antMatcher(POST, "/api/v1/auth/register")).hasRole(ADMIN.name())
//                                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/admin/**")).hasRole(ADMIN.name())
//                                .requestMatchers(AntPathRequestMatcher.antMatcher(POST, "/api/v1/auth/authenticate")).hasAnyRole(ADMIN.name(), USER.name())
//                                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/auth/authenticate"))
//                                .permitAll()
                                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/auth/authenticate")).permitAll()
                                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/auth/register")).hasAuthority(ADMIN.name())
                                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/admin/**")).hasAuthority(ADMIN.name())
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

}
