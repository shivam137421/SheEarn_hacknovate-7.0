package com.shearn.service;

import com.shearn.dto.AuthDto.*;
import com.shearn.model.User;
import com.shearn.repository.UserRepository;
import com.shearn.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Auth Service - manages user registration and login
 */
@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    /** Register a new user (woman or customer) */
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Build user document
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setVerificationStatus("PENDING");

        User saved = userRepository.save(user);

        // Generate JWT
        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole());

        return new AuthResponse(
                token, saved.getId(), saved.getName(),
                saved.getEmail(), saved.getRole(),
                saved.isVerified(), "Registration successful! Welcome to SheEarn."
        );
    }

    /** Login with email and password */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(
                token, user.getId(), user.getName(),
                user.getEmail(), user.getRole(),
                user.isVerified(), "Login successful!"
        );
    }
}
