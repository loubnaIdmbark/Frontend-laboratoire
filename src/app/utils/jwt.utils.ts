export function isTokenExpired(token: string): boolean {
  if (!token) {
    return true;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return payload.exp < currentTime;
}

export function getRolesFromToken(token: string): string[] {
  if (!token) {
    return [];
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles || [];
    return roles.map((role: string) => role.replace(/^ROLE_/, '')); // Remove "ROLE_" prefix
  } catch (error) {
    console.error('Failed to parse token:', error);
    return [];
  }
}

