package com.kdt03.ped_accident.global.service;

@Transactional
public LoginResponse loginService(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AuthenticationException("이메일 또는 비밀번호 오류"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new AuthenticationException("이메일 또는 비밀번호 오류");
    }

    if (!user.getEnabled()) {
        throw new AuthenticationException("비활성화된 계정");
    }

    String accessToken = jwtProvider.createAccessToken(user);
    String refreshToken = jwtProvider.createRefreshToken(user);

    user.updateRefreshToken(refreshToken);

    return new LoginResponse(accessToken, refreshToken);
}
