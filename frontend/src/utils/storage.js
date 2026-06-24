const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';
const SELECTED_SYMBOL_KEY = 'selectedSymbol';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(userId) {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function clearUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

export function clearAuth() {
  clearToken();
  clearUserId();
}

export function getSelectedSymbol() {
  return localStorage.getItem(SELECTED_SYMBOL_KEY);
}

export function setSelectedSymbol(symbol) {
  if (symbol) {
    localStorage.setItem(SELECTED_SYMBOL_KEY, symbol);
  } else {
    localStorage.removeItem(SELECTED_SYMBOL_KEY);
  }
}
