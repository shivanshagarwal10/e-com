package com.ecommerce.ecom_proj.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.ecommerce.ecom_proj.model.User;
import com.ecommerce.ecom_proj.repo.UserRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> u = userRepo.findByEmail(email);
        return u.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
