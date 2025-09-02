import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthContext from './context/AuthContext';
import authService from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.log('사용자 인증 확인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패해도 클라이언트에서는 사용자 정보 삭제
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus }}>
      <Router>
        <div className="App">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!user ? <Signup /> : <Navigate to="/" />} 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
