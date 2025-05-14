"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SplineBackground } from "@/components/spline-background"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setTimeout(() => {
      setFadeIn(true)
    }, 100)
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log('Attempting login with:', { email, password });

      // Test server connection first
      try {
        await axios.get('http://localhost:3001/health');
        console.log('Server is reachable');
      } catch (healthError) {
        console.error('Server health check failed:', healthError);
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }

      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Fade out before navigation
        setFadeIn(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });

      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(
          err.response?.data?.error || 
          err.message || 
          "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <SplineBackground />
      <div
        className={`relative z-10 w-full max-w-md p-4 transition-all duration-800 ease-in-out transform ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <Card className="border-border/50 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">DevOps Dashboard</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin} method="POST">
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
