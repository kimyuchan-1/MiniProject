package com.kdt03.ped_accident.domain.user.repository;

import com.kdt03.ped_accident.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    static Optional<User> findByEmail(String email) {
		return null;
	}

}
