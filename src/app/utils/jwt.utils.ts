export function isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < currentTime;
  }
  