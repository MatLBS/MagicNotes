import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@MagicNotes:auth_token";
const USER_DATA_KEY = "@MagicNotes:user_data";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private isAuthenticated = false;
  private currentUser: User | null = null;

  // Vérifier si l'utilisateur est connecté
  async checkAuthStatus(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        this.isAuthenticated = true;
        this.currentUser = JSON.parse(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification:",
        error
      );
      return false;
    }
  }

  // Connexion
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulation d'un appel API
      // Remplacez ceci par votre véritable API d'authentification

      if (email.includes("@") && password.length >= 6) {
        const mockResponse: AuthResponse = {
          token: `mock_token_${Date.now()}`,
          user: {
            id: "1",
            email: email,
            name: email.split("@")[0],
          },
        };

        // Sauvegarder les informations d'authentification
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(mockResponse.user)
        );

        this.isAuthenticated = true;
        this.currentUser = mockResponse.user;

        return mockResponse;
      } else {
        throw new Error("Email ou mot de passe invalide");
      }
    } catch (error) {
      throw new Error("Erreur lors de la connexion");
    }
  }

  // Inscription
  async signup(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulation d'un appel API
      // Remplacez ceci par votre véritable API d'inscription

      if (email.includes("@") && password.length >= 6) {
        const mockResponse: AuthResponse = {
          token: `mock_token_${Date.now()}`,
          user: {
            id: Date.now().toString(),
            email: email,
            name: email.split("@")[0],
          },
        };

        // Sauvegarder les informations d'authentification
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(mockResponse.user)
        );

        this.isAuthenticated = true;
        this.currentUser = mockResponse.user;

        return mockResponse;
      } else {
        throw new Error("Données invalides");
      }
    } catch (error) {
      throw new Error("Erreur lors de la création du compte");
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);

      this.isAuthenticated = false;
      this.currentUser = null;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw new Error("Erreur lors de la déconnexion");
    }
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Vérifier si l'utilisateur est connecté
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Récupérer le token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
