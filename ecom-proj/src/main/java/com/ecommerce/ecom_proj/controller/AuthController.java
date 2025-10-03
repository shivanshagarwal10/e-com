// src/main/java/com/ecommerce/ecom_proj/controller/AuthController.java
package com.ecommerce.ecom_proj.controller;

import com.ecommerce.ecom_proj.dto.AuthDtos.*;
import com.ecommerce.ecom_proj.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AuthController {

  private final UserService userService;
  public AuthController(UserService userService) { this.userService = userService; }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
    return ResponseEntity.ok(userService.register(req));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
    return ResponseEntity.ok(userService.login(req));
  }
}
