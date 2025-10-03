package com.ecommerce.ecom_proj.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.ecom_proj.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {
  boolean existsByEmail(String email);
  Optional<User> findByEmail(String email);
}
