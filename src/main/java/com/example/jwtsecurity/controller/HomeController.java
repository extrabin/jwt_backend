package com.example.jwtsecurity.controller;

import com.example.jwtsecurity.dto.AuthResponse;
import com.example.jwtsecurity.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Slf4j
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class HomeController {
    
    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> home() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getPrincipal().equals("anonymousUser")) {
            
            User user = (User) authentication.getPrincipal();
            response.put("message", "인증된 사용자의 홈 페이지입니다.");
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "name", user.getName(),
                "role", user.getRole().name()
            ));
            response.put("authenticated", true);
        } else {
            response.put("message", "공개 홈 페이지입니다.");
            response.put("authenticated", false);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/public/info")
    public ResponseEntity<Map<String, Object>> publicInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "이것은 공개 API입니다.");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
