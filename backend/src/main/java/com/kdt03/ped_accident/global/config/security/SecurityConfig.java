package com.kdt03.ped_accident.global.config.security;

import java.util.Arrays;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.kdt03.ped_accident.domain.accident.repository.AccidentHotspotRepository;
import com.kdt03.ped_accident.global.config.auth.CustomOAuth2UserService;
import com.kdt03.ped_accident.global.config.auth.JwtAccessDeniedHandler;
import com.kdt03.ped_accident.global.config.auth.JwtAuthenticationEntryPoint;
import com.kdt03.ped_accident.global.config.auth.JwtAuthenticationFilter;
import com.kdt03.ped_accident.global.config.auth.JwtTokenProvider;
import com.kdt03.ped_accident.global.config.auth.OAuth2FailureHandler;
import com.kdt03.ped_accident.global.config.auth.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final AccidentHotspotRepository accidentHotspotRepository;

	private final JwtTokenProvider jwtTokenProvider;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final OAuth2SuccessHandler oAuth2SuccessHandler;
	private final OAuth2FailureHandler oAuth2FailureHandler;
	// OAuth2 전용 필터 체인 (세션 필요)
	@Bean
    @Order(1)
    SecurityFilterChain oauthChain(HttpSecurity http) throws Exception {
    	http
    		.securityMatcher("/oauth2/**", "/login/oauth2/**")
    		.csrf(csrf -> csrf.disable())
    		.cors(cors -> cors.configurationSource(corsConfigurationSource()))
    		.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
    		.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
    		.oauth2Login(oauth2 -> oauth2
    	                .userInfoEndpoint(userInfo -> userInfo
    	                    .userService(customOAuth2UserService))
    	                .successHandler(oAuth2SuccessHandler)
    	                .failureHandler(oAuth2FailureHandler)
    	            );
    	return http.build();
    }

	// API 전용 필터 체인 (JWT, Stateless)
    @Bean
    @Order(2)
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint)
						.accessDeniedHandler(jwtAccessDeniedHandler))
				.authorizeHttpRequests(authz -> authz
						.requestMatchers("/api/public/**", "/api/auth/**")
						.permitAll()
						.requestMatchers("/api/dashboard/**").authenticated()
						.requestMatchers("/api/map/**").authenticated()
						.requestMatchers("/api/analysis/**").authenticated()
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.anyRequest().permitAll())
				.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
						UsernamePasswordAuthenticationFilter.class)
				.cors(cors -> cors.configurationSource(corsConfigurationSource()));

		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(
				Arrays.asList("http://localhost:3000", "https://primeval-trinh-nonfalteringly.ngrok-free.dev"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	
	@Bean
	CookieSameSiteSupplier cookieSameSiteSupplier() {
		return CookieSameSiteSupplier.ofNone()
				.whenHasName("accessToken");
	}
	
}