import api from "./api"

export async function loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
  try {
    const response = await api.post("/auth/login", { email, password })

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
    console.error("Login error:", error)
    throw new Error(error.response?.data?.error || "Invalid credentials")
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout")

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
    // Try to get user from API first
    const response = await api.get("/auth/me")
    return response.data.user
  } catch (error) {
    console.error("Get current user error:", error)

    // Fallback to localStorage if API fails
    const userStr = localStorage.getItem("user")
    if (userStr) {
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
