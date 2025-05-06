import { cookies } from "next/headers"

// Base URL for Spotify API
const SPOTIFY_API = "https://api.spotify.com/v1"

// Function to get the access token from cookies
export async function getAccessToken() {
  const cookieStore = cookies()
  return (await cookieStore).get("spotify_access_token")?.value
}

// Function to get the user data from cookies
export async function getUser() {
  const cookieStore = cookies()
  const userData = (await cookieStore).get("spotify_user")?.value

  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }

  return null
}

// Function to check if the user is authenticated
export function isAuthenticated() {
  return !!getAccessToken() && !!getUser()
}

// Function to fetch data from Spotify API
async function fetchFromSpotify(endpoint: string) {
  const accessToken = getAccessToken()

  if (!accessToken) {
    throw new Error("No access token available")
  }

  const response = await fetch(`${SPOTIFY_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  })

  if (!response.ok) {
    // Handle token expiration or other errors
    if (response.status === 401) {
      // In a real app, you would refresh the token here
      throw new Error("Access token expired")
    }
    throw new Error(`Spotify API error: ${response.statusText}`)
  }

  return response.json()
}

// Function to get the user's profile
export async function getUserProfile() {
  return fetchFromSpotify("/me")
}

// Function to get the user's currently playing track
export async function getCurrentlyPlaying() {
  try {
    return await fetchFromSpotify("/me/player/currently-playing")
  } catch (error) {
    console.error("Error fetching currently playing:", error)
    return null
  }
}

// Function to get the user's top tracks
export async function getTopTracks(timeRange = "short_term", limit = 5) {
  return fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`)
}

// Function to get the user's recently played tracks
export async function getRecentlyPlayed(limit = 20) {
  return fetchFromSpotify(`/me/player/recently-played?limit=${limit}`)
}

// Function to get the user's listening activity (this is a mock since Spotify doesn't provide this directly)
export async function getListeningActivity() {
  // In a real app, you would calculate this from recently played tracks
  // or store this data in your own database

  // For now, return mock data
  return {
    days: [
      { day: "Monday", hours: 2.5 },
      { day: "Tuesday", hours: 1.8 },
      { day: "Wednesday", hours: 3.2 },
      { day: "Thursday", hours: 2.1 },
      { day: "Friday", hours: 4.5 },
      { day: "Saturday", hours: 5.3 },
      { day: "Sunday", hours: 3.7 },
    ],
    total: 23.1,
    average: 3.3,
  }
}
