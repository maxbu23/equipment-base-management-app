package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.security.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String CLASS_NAME = "[JwtAuthenticationFilter]";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        log.info("{} Internal filter process starting...", CLASS_NAME);

        if (request.getServletPath().contains("/api/v1/auth") || request.getServletPath().contains("/h2-console")) {
            final String authHeader = request.getHeader("Authorization");
            final String authHeader2 = request.getHeader("authorization");
//        log.info("AuthHeader" + headersStrings);
            log.info("Authorization header: {}", authHeader);
            log.info("Authorization header: {}", authHeader2);
            filterChain.doFilter(request, response);
            return;
        }
//        Enumeration<String> headerNames = request.getHeaderNames();
//        List<String> headersStrings = new ArrayList<>();
//        while(headerNames.hasMoreElements()) {
//            headersStrings.add(headerNames.nextElement());
//        }


        final String authHeader = request.getHeader("Authorization");
//        log.info("AuthHeader" + headersStrings);
        log.info("Authorization header: {}", authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("{} headers does not contain Authorization header or header is invalid!", CLASS_NAME);
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwtToken);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.info("{} User is not authenticated yet", CLASS_NAME);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(jwtToken,userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);

    }
}
