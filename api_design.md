# JWT Security API 설계서

## 📋 개요

JWT(JSON Web Token)와 HttpOnly 쿠키를 사용한 안전한 인증 시스템 REST API 문서입니다.

### 기본 정보
- **Base URL**: `http://localhost:8080/api`
- **인증 방식**: JWT Token (HttpOnly Cookie)
- **Content-Type**: `application/json`
- **토큰 만료시간**: 2시간 (7,200초)

### 보안 특징
- ✅ HttpOnly 쿠키를 통한 JWT 저장 (XSS 방지)
- ✅ SameSite=Lax 설정 (CSRF 방지)
- ✅ CORS 설정으로 허용된 도메인만 접근 가능
- ✅ 입력값 검증 및 정화 (DOMPurify)
- ✅ 토큰 만료 시 자동 알림

---

## 🔐 인증 API

### 1. 회원가입
회원가입을 수행합니다.

**Endpoint**: `POST /api/auth/signup`

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "username": "string",     // 필수, 3-20자
  "email": "string",        // 필수, 유효한 이메일 형식
  "password": "string",     // 필수, 6-40자
  "name": "string"          // 필수, 최대 20자
}
```

**응답**:

성공 시 (201 Created):
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "테스트 사용자",
    "role": "USER"
  }
}
```

실패 시 (400 Bad Request):
```json
{
  "success": false,
  "message": "이미 존재하는 사용자명입니다."
}
```

**유효성 검증 오류**:
```json
{
  "success": false,
  "message": "입력값 검증에 실패했습니다.",
  "errors": {
    "username": "사용자명은 3-20자 사이여야 합니다",
    "email": "올바른 이메일 형식이 아닙니다",
    "password": "비밀번호는 6-40자 사이여야 합니다"
  },
  "timestamp": 1703068800000
}
```

---

### 2. 로그인
사용자 인증을 수행하고 JWT 토큰을 HttpOnly 쿠키로 설정합니다.

**Endpoint**: `POST /api/auth/login`

**요청 본문**:
```json
{
  "username": "string",     // 필수
  "password": "string"      // 필수
}
```

**응답**:

성공 시 (200 OK):
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "테스트 사용자",
    "role": "USER"
  }
}
```

**Set-Cookie 헤더 (자동 설정)**:
```http
Set-Cookie: accessToken=eyJhbGciOiJIUzI1NiJ9...; Path=/; Max-Age=7200; HttpOnly; SameSite=Lax
```

실패 시 (400 Bad Request):
```json
{
  "success": false,
  "message": "사용자명 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 3. 로그아웃
현재 사용자를 로그아웃하고 JWT 쿠키를 삭제합니다.

**Endpoint**: `POST /api/auth/logout`

**요청 헤더**:
```http
Cookie: accessToken=eyJhbGciOiJIUzI1NiJ9...
```

**응답**:

성공 시 (200 OK):
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

**Set-Cookie 헤더 (쿠키 삭제)**:
```http
Set-Cookie: accessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax
```

---

### 4. 현재 사용자 정보 조회
인증된 사용자의 정보를 조회합니다.

**Endpoint**: `GET /api/auth/me`

**요청 헤더**:
```http
Cookie: accessToken=eyJhbGciOiJIUzI1NiJ9...
```

**응답**:

성공 시 (200 OK):
```json
{
  "success": true,
  "message": "사용자 정보를 성공적으로 가져왔습니다.",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "테스트 사용자",
    "role": "USER"
  }
}
```

인증 실패 시 (400 Bad Request):
```json
{
  "success": false,
  "message": "인증되지 않은 사용자입니다."
}
```

---

## 🏠 일반 API

### 1. 홈 데이터 조회
홈 페이지 데이터를 조회합니다. 인증 상태에 따라 다른 정보를 반환합니다.

**Endpoint**: `GET /api/home`

**요청 헤더** (선택사항):
```http
Cookie: accessToken=eyJhbGciOiJIUzI1NiJ9...
```

**응답**:

인증된 사용자 (200 OK):
```json
{
  "message": "인증된 사용자의 홈 페이지입니다.",
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "name": "테스트 사용자",
    "role": "USER"
  }
}
```

비인증 사용자 (200 OK):
```json
{
  "message": "공개 홈 페이지입니다.",
  "authenticated": false
}
```

---

### 2. 공개 정보 조회
누구나 접근 가능한 공개 정보를 조회합니다.

**Endpoint**: `GET /api/public/info`

**인증**: 불필요

**응답**:

성공 시 (200 OK):
```json
{
  "message": "이것은 공개 API입니다.",
  "timestamp": 1703068800000
}
```

---

## 🚨 오류 응답

### 인증/권한 오류

**401 Unauthorized** - 토큰 만료:
```json
{
  "message": "토큰이 만료되었습니다. 다시 로그인해 주세요.",
  "status": 401,
  "error": "Expired JWT Token",
  "path": "/api/auth/me",
  "timestamp": "2023-12-20T10:00:00"
}
```

**401 Unauthorized** - 유효하지 않은 토큰:
```json
{
  "message": "유효하지 않은 토큰입니다.",
  "status": 401,
  "error": "Invalid JWT Token",
  "path": "/api/home",
  "timestamp": "2023-12-20T10:00:00"
}
```

### 서버 오류

**500 Internal Server Error**:
```json
{
  "message": "서버에서 오류가 발생했습니다.",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/auth/login",
  "timestamp": "2023-12-20T10:00:00"
}
```

---

## 🔒 보안 설정

### 허용된 엔드포인트 (인증 불필요)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/public/**` - 공개 API
- `GET /`, `/static/**`, `/favicon.ico` - 정적 리소스

### 인증 필요 엔드포인트
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 사용자 정보 조회
- `GET /api/home` - 홈 데이터 (인증 시 추가 정보 제공)

### CORS 설정
- **허용된 출처**: `http://localhost:3000` (프론트엔드)
- **허용된 메서드**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **허용된 헤더**: 모든 헤더 (`*`)
- **자격 증명 허용**: `true` (쿠키 전송)
- **최대 캐시 시간**: 3600초

---

## 🍪 쿠키 정보

### JWT 쿠키 설정
- **이름**: `accessToken`
- **경로**: `/` (전체 도메인)
- **만료시간**: 7200초 (2시간)
- **HttpOnly**: `true` (JavaScript 접근 불가)
- **Secure**: `false` (개발환경), `true` (운영환경)
- **SameSite**: `Lax` (CSRF 방지)

---

## 📝 사용 예시

### 회원가입 → 로그인 → 사용자 정보 조회

```bash
# 1. 회원가입
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "name": "테스트 사용자"
  }'

# 2. 로그인 (쿠키 저장)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# 3. 사용자 정보 조회 (저장된 쿠키 사용)
curl -X GET http://localhost:8080/api/auth/me \
  -b cookies.txt

# 4. 로그아웃
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt
```

---

## 🔧 환경 설정

### 필수 환경 변수
```properties
# JWT 설정
jwt.secret=mySecretKey12345678901234567890123456789012345678901234567890
jwt.expiration=7200000

# CORS 설정
app.frontend.url=http://localhost:3000

# 데이터베이스 설정
spring.datasource.url=jdbc:mysql://localhost:3306/jwtsecurity
spring.datasource.username=root
spring.datasource.password=root
```

---

## 📊 HTTP 상태 코드

| 상태 코드 | 의미 | 사용 상황 |
|----------|------|----------|
| 200 | OK | 성공적인 요청 |
| 201 | Created | 회원가입 성공 |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 401 | Unauthorized | 인증 실패, 토큰 만료 |
| 404 | Not Found | 존재하지 않는 리소스 |
| 500 | Internal Server Error | 서버 내부 오류 |

---

## 🔄 버전 정보

- **API 버전**: v1.0
- **JWT 라이브러리**: jjwt 0.12.3
- **Spring Boot**: 3.4.9
- **Java**: 17
- **문서 업데이트**: 2023-12-20
