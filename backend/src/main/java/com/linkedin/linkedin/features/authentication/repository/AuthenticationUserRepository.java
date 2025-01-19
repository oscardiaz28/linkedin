package com.linkedin.linkedin.features.authentication.repository;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuthenticationUserRepository  extends JpaRepository<AuthenticationUser, Long> {
    Optional<AuthenticationUser> findByEmail(String email);
    @Query(value = "SELECT * FROM users WHERE id != :id and email_verified = true", nativeQuery = true)
    List<AuthenticationUser> getUsersWithoutAuth(@Param("id") Long id);
}
