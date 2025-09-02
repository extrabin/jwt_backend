import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => {}
});

export default AuthContext;
