import axios from 'axios';
import DOMPurify from 'dompurify';

// axios 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 전송을 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 - 토큰 만료 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 홈페이지로 리다이렉트
      if (error.response.data?.message?.includes('만료')) {
        alert('토큰이 만료되었습니다. 다시 로그인해 주세요.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// XSS 방지를 위한 입력값 정화 함수
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  return input;
};

const authService = {
  // 회원가입
  signup: async (userData) => {
    try {
      const sanitizedData = sanitizeInput(userData);
      const response = await axiosInstance.post('/auth/signup', sanitizedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '회원가입에 실패했습니다.' };
    }
  },

  // 로그인
  login: async (credentials) => {
    try {
      const sanitizedCredentials = sanitizeInput(credentials);
      const response = await axiosInstance.post('/auth/login', sanitizedCredentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '로그인에 실패했습니다.' };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '로그아웃에 실패했습니다.' };
    }
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '사용자 정보를 가져오는데 실패했습니다.' };
    }
  },

  // 홈 데이터 가져오기
  getHomeData: async () => {
    try {
      const response = await axiosInstance.get('/home');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '홈 데이터를 가져오는데 실패했습니다.' };
    }
  },

  // 공개 정보 가져오기
  getPublicInfo: async () => {
    try {
      const response = await axiosInstance.get('/public/info');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '공개 정보를 가져오는데 실패했습니다.' };
    }
  }
};

export default authService;
