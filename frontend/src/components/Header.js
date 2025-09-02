import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();
      } catch (error) {
        console.error('로그아웃 오류:', error);
      }
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            JWT Security App
          </Link>
          
          <div className="user-info">
            {user ? (
              <>
                <span className="user-name">
                  안녕하세요, {user.name}님!
                </span>
                <button onClick={handleLogout} className="btn btn-danger">
                  로그아웃
                </button>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-primary">
                  로그인
                </Link>
                <Link to="/signup" className="btn btn-secondary">
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
