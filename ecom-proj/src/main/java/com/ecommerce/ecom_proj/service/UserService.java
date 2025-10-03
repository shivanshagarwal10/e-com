package com.ecommerce.ecom_proj.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.ecom_proj.dto.AuthDtos.AuthResponse;
import com.ecommerce.ecom_proj.dto.AuthDtos.LoginRequest;
import com.ecommerce.ecom_proj.dto.AuthDtos.RegisterRequest;
import com.ecommerce.ecom_proj.model.User;
import com.ecommerce.ecom_proj.repo.UserRepo;
import com.ecommerce.ecom_proj.security.JwtService;

@Service
public class UserService {

    @Autowired private UserRepo userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        if (req.getName() == null || req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("name/email/password required");
        }
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword())); // field must exist on entity
        u.setRole("ROLE_USER");
        userRepo.save(u);

        String token = jwtService.generateToken(u.getEmail(), Map.of("role", u.getRole()));
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtService.generateToken(req.getEmail(), Map.of());
        return new AuthResponse(token);
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
