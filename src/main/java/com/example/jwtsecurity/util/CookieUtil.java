package com.example.jwtsecurity.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
@Slf4j
public class CookieUtil {
    
    @Value("${jwt.expiration}")
    private Long jwtExpiration;
    
    public static final String JWT_COOKIE_NAME = "accessToken";
    
    public void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(JWT_COOKIE_NAME, token);
        cookie.setHttpOnly(true); // XSS 방지
        cookie.setSecure(false); // 개발환경에서는 false, 운영환경에서는 true
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtExpiration / 1000)); // 2시간
        
        // SameSite 속성을 헤더로 직접 설정 (CSRF 방지)
        response.addHeader("Set-Cookie", 
            String.format("%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax", 
                JWT_COOKIE_NAME, token, (int) (jwtExpiration / 1000)));
        
        log.info("JWT cookie added successfully");
    }
    
    public Optional<String> getJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        
        return Arrays.stream(request.getCookies())
                .filter(cookie -> JWT_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
    
    public void deleteJwtCookie(HttpServletResponse response) {
        // 쿠키 삭제를 위한 헤더 설정
        response.addHeader("Set-Cookie", 
            String.format("%s=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax", 
                JWT_COOKIE_NAME));
        
        log.info("JWT cookie deleted successfully");
    }
}
