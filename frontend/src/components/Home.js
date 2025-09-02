import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import authService from '../services/authService';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [homeData, setHomeData] = useState(null);
  const [publicData, setPublicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 홈 데이터와 공개 데이터를 병렬로 로드
      const [homeResponse, publicResponse] = await Promise.all([
        authService.getHomeData(),
        authService.getPublicInfo()
      ]);
      
      setHomeData(homeResponse);
      setPublicData(publicResponse);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="alert alert-error">
          {error}
        </div>
        <button onClick={loadData} className="btn btn-primary">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="welcome-message">
        <h1>JWT 보안 인증 시스템에 오신 것을 환영합니다!</h1>
        <p>HttpOnly 쿠키를 사용한 안전한 JWT 인증 시스템입니다.</p>
      </div>

      {user ? (
        <div>
          <div className="alert alert-success">
            <h2>🎉 로그인 성공!</h2>
            <p><strong>사용자명:</strong> {user.username}</p>
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>권한:</strong> {user.role}</p>
          </div>
          
          {homeData && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3>인증된 사용자 정보</h3>
              <p><strong>메시지:</strong> {homeData.message}</p>
              <p><strong>인증 상태:</strong> {homeData.authenticated ? '인증됨' : '인증되지 않음'}</p>
              {homeData.user && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p><strong>서버에서 확인된 사용자:</strong> {homeData.user.name} ({homeData.user.username})</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2>로그인이 필요합니다</h2>
            <p>모든 기능을 사용하려면 로그인해 주세요.</p>
            
            <div className="auth-links" style={{ marginTop: '1.5rem' }}>
              <Link to="/login" className="btn btn-primary">
                로그인
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                회원가입
              </Link>
            </div>
          </div>

          {homeData && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3>공개 정보</h3>
              <p><strong>메시지:</strong> {homeData.message}</p>
              <p><strong>인증 상태:</strong> {homeData.authenticated ? '인증됨' : '인증되지 않음'}</p>
            </div>
          )}
        </div>
      )}

      {publicData && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <h3>🌐 공개 API 정보</h3>
          <p><strong>메시지:</strong> {publicData.message}</p>
          <p><strong>타임스탬프:</strong> {new Date(publicData.timestamp).toLocaleString('ko-KR')}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>🔒 보안 특징</h3>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>JWT 토큰은 HttpOnly 쿠키에 저장되어 XSS 공격을 방지합니다</li>
          <li>토큰 만료 시간은 2시간입니다</li>
          <li>모든 입력값은 DOMPurify로 정화됩니다</li>
          <li>CORS 설정으로 안전한 도메인 간 통신을 보장합니다</li>
          <li>Spring Security를 통한 강력한 인증 및 권한 관리</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
