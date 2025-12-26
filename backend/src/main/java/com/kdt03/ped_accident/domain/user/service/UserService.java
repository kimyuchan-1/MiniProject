package com.kdt03.ped_accident.domain.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kdt03.ped_accident.api.dto.request.RegisterRequest;
import com.kdt03.ped_accident.domain.user.entity.Role;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(@Valid RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER) // 기본 역할을 USER로 설정
                .enabled(true)
                .build();

        return userRepository.save(user);
    }
}
