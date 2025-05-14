import api from "./api"

export async function loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
  try {
    console.log('Attempting login for:', email);
    const response = await api.post("/auth/login", { email, password })
    console.log('Login response:', response.data);

    // Store token and user in localStorage
    if (response.data.success) {
      const token = response.data.token;
      const user = response.data.user;
      
      console.log('Storing auth data:', { token, user });
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))
    }

    return {
      token: response.data.token,
      user: response.data.user,
    }
  } catch (error: any) {
    console.error("Login error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.error || "Invalid credentials")
  }
}

export async function logoutUser(): Promise<void> {
  try {
    console.log('Attempting logout');
    await api.post("/auth/logout")
    console.log('Logout successful');

    // Clear stored auth data
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  } catch (error) {
    console.error("Logout error:", error)

    // Still clear local storage even if API call fails
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }
}

export async function getCurrentUser(): Promise<any | null> {
  try {
    console.log('Fetching current user');
    // Try to get user from API first
    const response = await api.get("/auth/me")
    console.log('Current user response:', response.data);
    return response.data.user
  } catch (error) {
    console.error("Get current user error:", error)

    // Fallback to localStorage if API fails
    const userStr = localStorage.getItem("user")
    if (userStr) {
      console.log('Using cached user data');
      return JSON.parse(userStr)
    }
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser()
    return true
  } catch (error) {
    return false
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string; user: any }> {
  try {
    const response = await api.post("/auth/register", { name, email, password })

    // Store token and user in localStorage
    if (response.data.success) {
      localStorage.setItem("auth_token", response.data.token || "mock-jwt-token")
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return {
      token: response.data.token || "mock-jwt-token",
      user: response.data.user,
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    throw new Error(error.response?.data?.error || "Registration failed")
  }
}
