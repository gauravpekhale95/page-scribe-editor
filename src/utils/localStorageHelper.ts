// src/utils/localStorageHelper.ts
export class LocalStorageHelper {
  private static readonly ACCESS_TOKEN_KEY = 'okta_access_token';
  private static readonly USER_ROLE_KEY = 'user_role';

  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static clearAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  static setUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  static getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }

  static clearUserRole(): void {
    localStorage.removeItem(this.USER_ROLE_KEY);
  }

  static clearAll(): void {
    localStorage.clear();
    this.clearAccessToken();
    this.clearUserRole();
    
     
  }
}