import Link from "next/link"
import Image from "next/image"
import {
  Music,
  Headphones,
  MessageSquare,
} from "lucide-react"

export default function UserProfilePage() {
  // Mock data - in a real app, this would come from an API
  const userData = {
    name: "Gian Plariza",
    username: "centurie",
    profileImage: "/placeholder.svg?height=200&width=200",
    currentlyPlaying: {
      title: "GODSTAINED",
      artist: "Quadeca",
      album: "GODSTAINED",
      albumCover: "/placeholder.svg?height=60&width=60",
      progress: 0, // percentage
      duration: "3:26",
    },
    topTracks: [
      {
        id: 1,
        title: "song 1",
        artist: "artist",
        album: "album",
        albumCover: "/placeholder.svg?height=50&width=50",
      },
      {
        id: 2,
        title: "song 2",
        artist: "artist",
        album: "album",
        albumCover: "/placeholder.svg?height=50&width=50",
      },
      {
        id: 3,
        title: "song 3",
        artist: "artist",
        album: "album",
        albumCover: "/placeholder.svg?height=50&width=50",
      },
      {
        id: 4,
        title: "song 4",
        artist: "artist",
        album: "album",
        albumCover: "/placeholder.svg?height=50&width=50",
      },
      {
        id: 5,
        title: "song 5",
        artist: "artist",
        album: "album",
        albumCover: "/placeholder.svg?height=50&width=50",
      },
    ],
    promptOfTheDay: "A song you like with a fruit in the title",
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 to-white">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-8 w-8 text-violet-600" />
          <span className="text-xl font-bold text-violet-900">my music diary.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="../" className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline">
            Log Out
          </Link>
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
                    src={userData.profileImage || "/placeholder.svg"}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-violet-900">{userData.name}</h1>
                  <p className="text-violet-600">@{userData.username}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
                      <Headphones className="mr-1 h-3 w-3" />
                      Spotify Premium
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
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={userData.currentlyPlaying.albumCover}
                    alt={userData.currentlyPlaying.album}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-violet-900">{userData.currentlyPlaying.title}</h3>
                  <p className="text-sm text-violet-500">{userData.currentlyPlaying.artist}</p>
                  <p className="text-xs text-violet-500">{userData.currentlyPlaying.album}</p>
                </div>
              </div>
            </div>
          </div>

          {/* potd */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Prompt of the Day</h2>
              <div className="rounded-lg bg-violet-50 p-4">
                <p className="text-violet-800">{userData.promptOfTheDay}</p>
              </div>
              <div className="mt-4">
                <textarea
                  className="w-full rounded-md border border-violet-200 p-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  rows={3}
                  placeholder="Share your thoughts..."
                ></textarea>
                <button className="mt-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                  Save to Diary
                </button>
              </div>
            </div>
          </div>

          {/* top tracks */}
          <div className="md:col-span-3 lg:col-span-1">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Your Top 5 Tracks</h2>
              <div className="space-y-3">
                {userData.topTracks.map((track) => (
                  <div key={track.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={track.albumCover || "/placeholder.svg"}
                        alt={track.album}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-medium text-violet-900">{track.title}</h3>
                      <p className="truncate text-xs text-violet-700">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* recent activity */}
          <div className="md:col-span-3 lg:col-span-3">
            <div className="rounded-lg border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-violet-900">Recent Activity</h2>
              <div className="space-y-4">

                <div className="flex gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={userData.profileImage}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 rounded-lg bg-violet-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-violet-900">{userData.name}</p>
                      <span className="text-xs text-violet-500">Yesterday</span>
                    </div>
                    <p className="mt-1 text-sm text-violet-700">
                      Listened to <span className="font-medium">GODSTAINED</span> by{" "}
                      <span className="font-medium">Quadeca</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-violet-600">
                        <MessageSquare className="h-3 w-3" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={userData.profileImage}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 rounded-lg bg-violet-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-violet-900">{userData.name}</p>
                      <span className="text-xs text-violet-500">Yesterday</span>
                    </div>
                    <p className="mt-1 text-sm text-violet-700">
                      Listened to <span className="font-medium">GODSTAINED</span> by{" "}
                      <span className="font-medium">Quadeca</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-violet-600">
                        <MessageSquare className="h-3 w-3" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={userData.profileImage}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 rounded-lg bg-violet-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-violet-900">{userData.name}</p>
                      <span className="text-xs text-violet-500">Yesterday</span>
                    </div>
                    <p className="mt-1 text-sm text-violet-700">
                      Listened to <span className="font-medium">GODSTAINED</span> by{" "}
                      <span className="font-medium">Quadeca</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-violet-600">
                        <MessageSquare className="h-3 w-3" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
                
              </div>
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
          <p className="text-sm text-violet-700">
            &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

