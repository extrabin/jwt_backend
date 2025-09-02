package com.example.jwtsecurity.service;

import com.example.jwtsecurity.dto.AuthResponse;
import com.example.jwtsecurity.dto.LoginRequest;
import com.example.jwtsecurity.dto.SignupRequest;
import com.example.jwtsecurity.entity.Role;
import com.example.jwtsecurity.entity.User;
import com.example.jwtsecurity.repository.UserRepository;
import com.example.jwtsecurity.util.CookieUtil;
import com.example.jwtsecurity.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // 중복 검사
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("이미 존재하는 사용자명입니다.")
                    .build();
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("이미 존재하는 이메일입니다.")
                    .build();
        }
        
        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());
        
        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().name())
                .build();
        
        return AuthResponse.builder()
                .success(true)
                .message("회원가입이 완료되었습니다.")
                .user(userInfo)
                .build();
    }
    
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        try {
            // 인증 수행
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            User user = (User) authentication.getPrincipal();
            
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user);
            
            // HttpOnly 쿠키에 토큰 저장
            cookieUtil.addJwtCookie(response, token);
            
            log.info("User logged in successfully: {}", user.getUsername());
            
            AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name())
                    .build();
            
            return AuthResponse.builder()
                    .success(true)
                    .message("로그인에 성공했습니다.")
                    .user(userInfo)
                    .build();
            
        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for username: {}", request.getUsername());
            return AuthResponse.builder()
                    .success(false)
                    .message("사용자명 또는 비밀번호가 올바르지 않습니다.")
                    .build();
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for username: {}", request.getUsername());
            return AuthResponse.builder()
                    .success(false)
                    .message("인증에 실패했습니다.")
                    .build();
        }
    }
    
    public AuthResponse logout(HttpServletResponse response) {
        // JWT 쿠키 삭제
        cookieUtil.deleteJwtCookie(response);
        
        return AuthResponse.builder()
                .success(true)
                .message("로그아웃되었습니다.")
                .build();
    }
}
