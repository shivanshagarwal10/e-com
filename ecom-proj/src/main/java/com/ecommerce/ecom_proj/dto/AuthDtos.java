package com.ecommerce.ecom_proj.dto;

public class AuthDtos {
  public static class RegisterRequest {
    private String name;
    private String email;
    private String password;

    public RegisterRequest() {}
    public RegisterRequest(String name, String email, String password) {
      this.name = name; this.email = email; this.password = password;
    }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
  }

  public static class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}
    public LoginRequest(String email, String password) {
      this.email = email; this.password = password;
    }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
  }

  public static class AuthResponse {
    private String token;
    public AuthResponse() {}
    public AuthResponse(String token) { this.token = token; }
    public String getToken() { return token; }
  }
}

