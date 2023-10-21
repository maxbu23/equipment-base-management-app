package org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config;

import org.buczek.engineering.thesis.app.equipmentbasemanagementapp.config.exception.IncorrectPasswordException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(IncorrectPasswordException.class)
    protected ResponseEntity<Object> handleIncorrectPasswordException(
            RuntimeException ex,
            WebRequest request
    ) {
        return handleExceptionInternal(
                ex,
                "Current password is incorrect!",
                new HttpHeaders(),
                HttpStatus.UNAUTHORIZED,
                request
        );
    }
}
