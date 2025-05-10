// Mock authentication service

export async function loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // Simple validation for demo purposes
      if (email === "admin@example.com" && password === "password") {
        const token = "mock-jwt-token"
        const user = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        }

        // Store in localStorage for persistence
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user", JSON.stringify(user))

        resolve({ token, user })
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 800)
  })
}

export async function logoutUser(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Clear stored auth data
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      resolve()
    }, 300)
  })
}

export async function getCurrentUser(): Promise<any | null> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        resolve(JSON.parse(userStr))
      } else {
        resolve(null)
      }
    }, 300)
  })
}

export async function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const token = localStorage.getItem("auth_token")
      resolve(!!token)
    }, 100)
  })
}
