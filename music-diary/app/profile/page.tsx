"use client"

import { useState, useEffect } from "react"
import { supabase } from '../../utils/supabase'
import Link from "next/link"
import Image from "next/image"
import { Music, Headphones, MessageSquare, Loader2, Play, Pause, SkipBack, SkipForward } from "lucide-react"

// Define types for our data
interface SpotifyUser {
  name: string
  username: string
  profileImage: string
  isPremium: boolean
}

interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumCover: string
  playedAt?: string
}

interface CurrentlyPlaying {
  title: string
  artist: string
  album: string
  albumCover: string
  progress: number
  duration: string
  progressTime: string
  isPlaying: boolean
}

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<SpotifyUser>({
    name: "Gian Plariza",
    username: "centurie",
    profileImage: "/placeholder.svg?height=200&width=200",
    isPremium: false,
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null)
  const [topTracks, setTopTracks] = useState<Track[]>([])
  const [recentTracks, setRecentTracks] = useState<Track[]>([])
  const [promptOfTheDay, setPromptOfTheDay] = useState<string | null>(null)
  const [promptId, setPromptId] = useState<number | null>(null)


  // Fetch all data on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
      setIsLoading(false)
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)

    // Fetch all data
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(accessToken),
          fetchCurrentlyPlaying(accessToken),
          fetchTopTracks(accessToken),
          fetchRecentlyPlayed(accessToken),
        ])
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchAllData()

    function getDayOfYear(): number {
        const now = new Date()
        const start = new Date(now.getFullYear(), 0, 0)
        const diff = now.getTime() - start.getTime()
        const oneDay = 1000 * 60 * 60 * 24
        return Math.floor(diff / oneDay)
      }

      

    async function fetchPrompt() {

      var dayEquation = getDayOfYear() % 32 + 1
      const date = new Date()
      console.log(dayEquation + getDayOfYear() + "this is the day equation")

      const { data, error } = await supabase
        .from('Prompts')
        .select('id, prompt_string')
        .eq('id', dayEquation)
        .single()

      if (error) {
        console.error('Error fetching prompt:', error)
      } else if (data?.prompt_string) {
        setPromptOfTheDay(data.prompt_string)
        setPromptId(data.id)


      }
    }

    fetchPrompt();




    // Set up polling for currently playing track (every 30 seconds)
    const pollingInterval = setInterval(() => {
      const token = localStorage.getItem("access_token")
      if (token) {
        fetchCurrentlyPlaying(token)
      }
    }, 30000)

    return () => clearInterval(pollingInterval)
  }, [])

  // Fetch user profile from Spotify
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser({
          name: data.display_name || "Spotify User",
          username: data.id || "user",
          profileImage: data.images?.[0]?.url || "/placeholder.svg?height=200&width=200",
          isPremium: data.product === "premium",
        })
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  // Fetch currently playing track from Spotify
  const fetchCurrentlyPlaying = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        const data = await response.json()
        if (data && data.item) {
          setCurrentlyPlaying({
            title: data.item.name,
            artist: data.item.artists.map((a: any) => a.name).join(", "),
            album: data.item.album.name,
            albumCover: data.item.album.images[0]?.url || "/placeholder.svg?height=60&width=60",
            progress: (data.progress_ms / data.item.duration_ms) * 100,
            duration: formatDuration(data.item.duration_ms),
            progressTime: formatDuration(data.progress_ms),
            isPlaying: data.is_playing,
          })
        } else {
          setCurrentlyPlaying(null)
        }
      } else if (response.status === 204) {
        // No content - user is not playing anything
        setCurrentlyPlaying(null)
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error fetching currently playing track:", error)
    }
  }

  // Fetch top tracks from Spotify
  const fetchTopTracks = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data && data.items && data.items.length > 0) {
          const formattedTracks = data.items.map((track: any) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            albumCover: track.album.images[0]?.url || "/placeholder.svg?height=50&width=50",
          }))

          setTopTracks(formattedTracks)
        }
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error fetching top tracks:", error)
    }
  }

  // Fetch recently played tracks from Spotify
  const fetchRecentlyPlayed = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data && data.items && data.items.length > 0) {
          const formattedTracks = data.items.map((item: any) => ({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map((a: any) => a.name).join(", "),
            album: item.track.album.name,
            albumCover: item.track.album.images[0]?.url || "/placeholder.svg?height=50&width=50",
            playedAt: formatPlayedAt(new Date(item.played_at)),
          }))

          setRecentTracks(formattedTracks)
        }
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error fetching recently played tracks:", error)
    }
  }

  // Handle playback control
  const handlePlayPause = async () => {
    if (!currentlyPlaying) return

    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return

    const endpoint = currentlyPlaying.isPlaying
      ? "https://api.spotify.com/v1/me/player/pause"
      : "https://api.spotify.com/v1/me/player/play"

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok || response.status === 204) {
        // Update local state immediately for better UX
        setCurrentlyPlaying((prev) => (prev ? { ...prev, isPlaying: !prev.isPlaying } : null))

        // Fetch the updated state after a short delay
        setTimeout(() => fetchCurrentlyPlaying(accessToken), 500)
      } else if (response.status === 401) {
        refreshToken()
      } else {
        console.error("Error controlling playback:", await response.text())
      }
    } catch (error) {
      console.error("Error controlling playback:", error)
    }
  }

  // Handle skip to next track
  const handleSkipNext = async () => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok || response.status === 204) {
        // Wait a moment for Spotify to update
        setTimeout(() => fetchCurrentlyPlaying(accessToken), 500)
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error skipping to next track:", error)
    }
  }

  // Handle skip to previous track
  const handleSkipPrevious = async () => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok || response.status === 204) {
        // Wait a moment for Spotify to update
        setTimeout(() => fetchCurrentlyPlaying(accessToken), 500)
      } else if (response.status === 401) {
        refreshToken()
      }
    } catch (error) {
      console.error("Error going to previous track:", error)
    }
  }

  const refreshToken = () => {
    // This would typically call your refreshAccessToken function from app.js
    // For now, we'll just redirect to login
    window.location.href = "/"
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    window.location.href = "/"
  }
 
  const [response, setResponse] = useState('');
  const [userPrompts, setUserPrompts] = useState([]);


useEffect(() => {
  console.log("NO FUCKING CLUE" + user.name)
  const fetchUserPrompts = async () => {
    if (!user.name) return;

    const { data, error } = await supabase
      .from('User Prompts')
      .select('*')
      .eq('spotify_user', user.name); // Adjust field to match your schema

    if (error) {
      console.error('Error fetching prompts:', error);
    } else {
      setUserPrompts(data);
    }
  };

  fetchUserPrompts();
}, [user.name]);

const saveResponse = async () => {
  if (!response.trim()) return;
console.log("hahahha"+ promptOfTheDay, promptId)
  const { data, error } = await supabase
    .from('User Prompts')
    .insert([
      {
        'spotify_user': user.name,
        prompt_id: promptId,
        prompt_answers: response.trim(),
        prompt_question: promptOfTheDay, 
      },
    ]).select();

  if (error) {
    console.error('Error saving response:', error);
  } else {
    setResponse('');
    window.location.reload();
  }
};




  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2 text-lg text-violet-900">Loading your profile...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-violet-50 to-white p-4 text-center">
        <Music className="h-16 w-16 text-violet-600" />
        <h1 className="mt-6 text-2xl font-bold text-violet-900">Not Logged In</h1>
        <p className="mt-2 max-w-md text-violet-700">
          You need to log in with your Spotify account to view your profile.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 to-white">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-8 w-8 text-violet-600" />
          <span className="text-xl font-bold text-violet-900">my music diary.</span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* user profile */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-violet-200">
                  <Image
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-violet-900">{user.name}</h1>
                  <p className="text-violet-600">@{user.username}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
                      <Headphones className="mr-1 h-3 w-3" />
                      {user.isPremium ? "Spotify Premium" : "Spotify Free"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* currently listening to */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Currently Listening To</h2>
              {currentlyPlaying ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={currentlyPlaying.albumCover || "/placeholder.svg"}
                        alt={currentlyPlaying.album}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-violet-900">{currentlyPlaying.title}</h3>
                      <p className="text-sm text-violet-500">{currentlyPlaying.artist}</p>
                      <p className="text-xs text-violet-500">{currentlyPlaying.album}</p>
                      <div className="mt-2">
                        <div className="relative h-1.5 w-full rounded-full bg-violet-100">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-violet-600"
                            style={{ width: `${currentlyPlaying.progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-violet-500">
                          <span>{currentlyPlaying.progressTime}</span>
                          <span>{currentlyPlaying.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-violet-700">Not currently playing anything</p>
                  <p className="text-sm text-violet-500">Start playing something on Spotify to see it here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt of the Day */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">
                Prompt of the Day – {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>

              <div className="rounded-lg bg-violet-50 p-4">
                <p className="text-violet-800">{promptOfTheDay}</p>
              </div>

              <div className="mt-4">
                <textarea
                  className="w-full rounded-md border border-violet-200 p-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
                <button
                  onClick={saveResponse}
                  className="mt-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Save to Diary
                </button>
              </div>

              {/* User's past entries */}
              {userPrompts.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-md font-semibold text-violet-900">Your Past Entries:</h3>
                  <ul className="space-y-2">
                    {userPrompts.map((entry) => (
                      <li key={entry.id} className="rounded-md bg-violet-100 p-3 text-sm text-violet-800">
                        <strong>{entry.prompt_question}</strong>: {entry.prompt_answers}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>


          {/* top tracks */}
          <div className="md:col-span-3 lg:col-span-1">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Your Top 5 Tracks</h2>
              {topTracks.length > 0 ? (
                <div className="space-y-3">
                  {topTracks.map((track) => (
                    <div key={track.id} className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={track.albumCover || "/placeholder.svg"}
                          alt={track.album}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-violet-900">{track.title}</h3>
                        <p className="truncate text-xs text-violet-700">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-violet-700">No top tracks found</p>
                  <p className="text-sm text-violet-500">Listen to more music to see your top tracks</p>
                </div>
              )}
            </div>
          </div>

          {/* recent activity */}
          <div className="md:col-span-3 lg:col-span-3">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Recent Activity</h2>
              {recentTracks.length > 0 ? (
                <div className="space-y-4">
                  {recentTracks.slice(0, 3).map((track) => (
                    <div key={`activity-${track.id}-${track.playedAt}`} className="flex gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={user.profileImage || "/placeholder.svg"}
                          alt={user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 rounded-lg bg-violet-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-violet-900">{user.name}</p>
                          <span className="text-xs text-violet-500">{track.playedAt}</span>
                        </div>
                        <p className="mt-1 text-sm text-violet-700">
                          Listened to <span className="font-medium">{track.title}</span> by{" "}
                          <span className="font-medium">{track.artist}</span>
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button className="flex items-center gap-1 text-xs text-violet-600">
                            <MessageSquare className="h-3 w-3" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-violet-700">No recent activity found</p>
                  <p className="text-sm text-violet-500">Listen to some music to see your activity</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-violet-100 bg-white py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">my music diary.</span>
          </div>
          <p className="text-sm text-violet-700">&copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// Helper function to format duration in milliseconds to MM:SS format
function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Helper function to format played_at timestamp to relative time
function formatPlayedAt(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`

  return date.toLocaleDateString()
}
