package com.kdt03.ped_accident.domain.user.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kdt03.ped_accident.api.dto.request.RegisterRequest;
import com.kdt03.ped_accident.domain.user.entity.AuthProvider;
import com.kdt03.ped_accident.domain.user.entity.Role;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.repository.UserRepository;
import com.kdt03.ped_accident.global.exception.custom.DataNotFoundException;
import com.kdt03.ped_accident.global.exception.custom.DuplicateEmailException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User signUp(RegisterRequest request) {
        if (existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("가입되지 않은 이메일입니다."));
    }

    @Transactional
    public void updateRefreshToken(Long userId, String refreshToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));
        user.setRefreshToken(refreshToken);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User findOrCreateOAuthUser(String email, AuthProvider provider) {
        return userRepository.findByEmail(email)
            .map(user -> {
                if (user.getProvider() != provider) {
                    throw new IllegalStateException("이미 다른 로그인 방식으로 가입된 계정입니다.");
                }
                return user;
            })
            .orElseGet(() -> {
                User user = User.builder()
                    .email(email)
                    .provider(provider)
                    .role(Role.USER)
                    .build();
                return userRepository.save(user);
            });
    }
}

