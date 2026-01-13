package com.kdt03.ped_accident.domain.user.repository;

import com.kdt03.ped_accident.domain.user.entity.AuthProvider;
import com.kdt03.ped_accident.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}

