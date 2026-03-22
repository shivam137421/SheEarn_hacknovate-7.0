package com.shearn.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

/**
 * DTOs for Authentication (login/signup)
 */
public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Valid email required")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "WOMAN|CUSTOMER", message = "Role must be WOMAN or CUSTOMER")
        private String role;

        private String phone;
        private String city;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @Email(message = "Valid email required")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private String id;
        private String name;
        private String email;
        private String role;
        private boolean isVerified;
        private String message;
    }
}
