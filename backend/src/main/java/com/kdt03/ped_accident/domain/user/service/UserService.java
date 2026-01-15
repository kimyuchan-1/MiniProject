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
    
    @Transactional
    public User updateMyName(Long userId, String newName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        user.setName(newName); // 엔티티에 setter 없으면 updateName 메서드로
        // JPA면 트랜잭션 커밋 시 dirty checking으로 저장됨
        return user;
    }
    
    @Transactional
    public void changeMyPassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 현재 비밀번호 검증
        if (user.getPassword() == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다");
        }

        // 새 비밀번호가 현재와 동일한지 방지(선택)
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 달라야 합니다");
        }

        user.setPassword(passwordEncoder.encode(newPassword)); // setter 없으면 user.updatePassword(...)
    }
}
