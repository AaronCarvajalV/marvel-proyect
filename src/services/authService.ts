
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CONSULTA'; // Assuming these roles based on the prompt
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (credentials.email === 'aaron' && credentials.password === '1234') {
      return {
        access_token: 'mock-token-xyz',
        user: { id: 1, name: 'Aaron', email: 'aaron@stark.com', role: 'ADMIN' as const }
      };
    }
    throw new Error('Invalid credentials');
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
  
  getMe: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id: 1, name: 'Aaron', email: 'aaron@stark.com', role: 'ADMIN' as const };
  }
};
