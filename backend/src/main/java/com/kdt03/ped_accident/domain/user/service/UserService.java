package com.kdt03.ped_accident.domain.user.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
                .provider(AuthProvider.LOCAL)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("가입되지 않은 이메일입니다."));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * OAuth 로그인 시 사용자 조회 또는 생성
     * 이미 존재하는 이메일이면 해당 유저 반환
     * 동시성 문제 시 안전하게 처리
     */
    @Transactional
    public User findOrCreateOAuthUser(AuthProvider provider, String providerId, String email) {
        return userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    User user = User.builder()
                            .provider(provider)
                            .providerId(providerId)
                            .email(email)
                            .role(Role.USER)
                            .enabled(true)
                            .password(new BCryptPasswordEncoder().encode("OAuthDummyPassword"))
                            .build();
                    try {
                        return userRepository.saveAndFlush(user);
                    } catch (DataIntegrityViolationException e) {
                        userRepository.flush(); // 혹은 entityManager.clear();
                        return userRepository.findByProviderAndProviderId(provider, providerId)
                                .orElseThrow(() -> e);
                    }
                });
    }
}
