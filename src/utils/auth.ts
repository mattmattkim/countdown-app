export const checkAuth = (): boolean => {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'countdown_auth' && value === 'true') {
      return true;
    }
  }
  
  return false;
};

export const clearAuth = (): void => {
  document.cookie = 'countdown_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
};