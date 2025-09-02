# JWT 보안 인증 시스템

HttpOnly 쿠키를 사용한 안전한 JWT 인증 시스템입니다.

## 🔧 기술 스택

### 백엔드
- Java 17
- Spring Boot 3.4.9
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT (JSON Web Token)
- Lombok

### 프론트엔드
- React 18
- React Router DOM
- Axios
- DOMPurify (XSS 방지)

## 🚀 실행 방법

### 1. 데이터베이스 설정

MySQL을 설치하고 다음 설정으로 데이터베이스를 생성하세요:

```sql
CREATE DATABASE jwtsecurity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

또는 `application.properties`의 데이터베이스 URL에서 `createDatabaseIfNotExist=true` 옵션으로 자동 생성됩니다.

### 2. 백엔드 실행

```bash
# 프로젝트 루트 디렉토리에서
mvn clean install
mvn spring-boot:run
```

또는 IDE에서 `JwtSecurity2705Application.java` 실행

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 3. 프론트엔드 실행

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

## 📋 주요 기능

### 🔐 보안 기능
- **HttpOnly 쿠키**: JWT 토큰을 HttpOnly 쿠키에 저장하여 XSS 공격 방지
- **SameSite 속성**: CSRF 공격 방지를 위한 쿠키 설정
- **입력값 정화**: DOMPurify를 사용한 XSS 방지
- **토큰 만료 처리**: 2시간 후 자동 토큰 만료 및 알림
- **CORS 설정**: 안전한 도메인 간 통신

### 📱 사용자 기능
- **회원가입**: 사용자명, 이메일, 비밀번호, 이름으로 계정 생성
- **로그인**: 사용자명과 비밀번호로 인증
- **로그아웃**: 안전한 토큰 삭제
- **사용자 정보 표시**: 헤더에 로그인한 사용자명 표시

## 🌐 API 엔드포인트

### 인증 관련
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 일반
- `GET /api/home` - 홈 데이터
- `GET /api/public/info` - 공개 정보

## 🔒 보안 특징

1. **JWT 토큰 보안**
   - HttpOnly 쿠키에 저장되어 JavaScript에서 접근 불가
   - 2시간 만료 시간 설정
   - 강력한 시크릿 키 사용

2. **XSS 방지**
   - 모든 사용자 입력값은 DOMPurify로 정화
   - HttpOnly 쿠키로 토큰 보호
   - 적절한 HTML 이스케이핑

3. **CSRF 방지**
   - SameSite=Lax 쿠키 속성 설정
   - CORS 설정으로 허용된 도메인만 접근 가능

4. **입력값 검증**
   - 프론트엔드와 백엔드 모두에서 입력값 검증
   - Bean Validation 사용
   - 적절한 에러 메시지 제공

## 📁 프로젝트 구조

```
JWTSecurity2705/
├── src/main/java/com/example/jwtsecurity/
│   ├── config/           # 설정 클래스
│   ├── controller/       # REST 컨트롤러
│   ├── dto/             # 데이터 전송 객체
│   ├── entity/          # JPA 엔티티
│   ├── exception/       # 예외 처리
│   ├── filter/          # JWT 필터
│   ├── repository/      # 데이터 접근 레이어
│   ├── service/         # 비즈니스 로직
│   └── util/            # 유틸리티 클래스
├── frontend/
│   ├── public/          # 정적 파일
│   └── src/
│       ├── components/  # React 컴포넌트
│       ├── context/     # React Context
│       └── services/    # API 서비스
└── README.md
```

## ⚙️ 환경 설정

### application.properties 주요 설정

```properties
# 데이터베이스 설정
spring.datasource.url=jdbc:mysql://localhost:3306/jwtsecurity
spring.datasource.username=root
spring.datasource.password=root

# JWT 설정
jwt.secret=mySecretKey12345678901234567890123456789012345678901234567890
jwt.expiration=7200000  # 2시간 (밀리초)

# CORS 설정
app.frontend.url=http://localhost:3000
```

## 🧪 테스트

1. **회원가입 테스트**
   - 유효한 정보로 회원가입
   - 중복 사용자명/이메일 확인
   - 입력값 검증 확인

2. **로그인 테스트**
   - 올바른 자격증명으로 로그인
   - 잘못된 자격증명 처리
   - 토큰 쿠키 설정 확인

3. **보안 테스트**
   - HttpOnly 쿠키 확인
   - 토큰 만료 처리
   - XSS 방지 확인

## 🚨 주의사항

1. **운영환경 설정**
   - `application.properties`에서 실제 데이터베이스 정보 설정
   - JWT 시크릿 키를 안전한 값으로 변경
   - 쿠키의 `secure` 속성을 `true`로 설정 (HTTPS 사용 시)

2. **보안 권장사항**
   - 정기적인 JWT 시크릿 키 교체
   - HTTPS 사용 권장
   - 적절한 로깅 및 모니터링 설정

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.
