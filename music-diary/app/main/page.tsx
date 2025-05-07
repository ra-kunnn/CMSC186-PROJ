"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MainPage() {
  const router = useRouter()

  useEffect(() => {
    // This page is the redirect target from Spotify OAuth
    // It will handle the code exchange and then redirect to the profile page
    if (window.location.search.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")

      if (code) {
        // Call the function from your app.js to handle the code
        // This assumes your app.js is loaded globally
        if (typeof window !== "undefined" && window.handleRedirect) {
          window.handleRedirect()
        } else {
          // Fallback if handleRedirect is not available
          handleSpotifyCode(code)
        }
      }
    }

    // Check if we already have an access token
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
      // Redirect to profile page
      router.push("/profile")
    }
  }, [router])

  // Fallback implementation if app.js handleRedirect is not available
  const handleSpotifyCode = async (code: string) => {
    try {
      const clientId = localStorage.getItem("client_id") || "48f8ba37a78a458a9a93fcb563b19ea7"
      const clientSecret = localStorage.getItem("client_secret") || "30e066cff0484a75a03e74ab0a87bf9c"
      const redirectUri = "http://127.0.0.1:3000/main"

      // Exchange code for token
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to exchange code for token")
      }

      const data = await response.json()

      // Store tokens
      localStorage.setItem("access_token", data.access_token)
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token)
      }

      // Clean up URL and redirect to profile
      window.history.pushState({}, "", redirectUri)
      router.push("/profile")
    } catch (error) {
      console.error("Error handling Spotify code:", error)
      router.push("/?error=AuthenticationFailed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 to-white">
      <div className="text-center">
        <div className="mb-4 inline-block animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 h-12 w-12"></div>
        <p className="text-violet-900 font-medium">Processing your authentication...</p>
        <p className="text-violet-600 text-sm mt-2">You'll be redirected to your profile shortly.</p>
      </div>
    </div>
  )
}
