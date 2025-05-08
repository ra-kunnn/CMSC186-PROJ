import { Music } from "lucide-react"
import SpotifyAuth from '@/components/spotifyAuthButton';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 to-white">
      {/*
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Music className="h-8 w-8 text-violet-600" />
          <span className="text-xl font-bold text-violet-900">my music diary.</span>
        </div>
      </header>
      */}

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-10 px-4 py-20 text-center md:px-6 md:py-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-violet-100 p-6">
              <Music className="h-16 w-16 text-violet-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-violet-900 sm:text-5xl md:text-6xl">
              my music diary.
            </h1>
            <p className="max-w-[700px] text-lg text-violet-700 md:text-xl">
              your music thoughts all in one site!
            </p>
          </div>

          <SpotifyAuth />
        </section>

        <section className="container mx-auto px-4 py-12 md:px-6 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-violet-100 bg-white p-6 text-center shadow-sm">
              <div className="rounded-full bg-violet-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-violet-600"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-violet-900">Spotify Integration</h3>
              <p className="text-violet-700">
                Track your listening activity on Spotify!
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 rounded-lg border border-violet-100 bg-white p-6 text-center shadow-sm">
              <div className="rounded-full bg-violet-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-violet-600"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-violet-900">Listening Activity</h3>
              <p className="text-violet-700">
                Keep a record of all the tracks you listened to.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 rounded-lg border border-violet-100 bg-white p-6 text-center shadow-sm">
              <div className="rounded-full bg-violet-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-violet-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-violet-900">Forum Section</h3>
              <p className="text-violet-700">
                Talk about what you like — or not like — about a song!
              </p>
            </div>

          </div>
        </section>

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
