import Link from "next/link"
import { Music } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 to-white">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Music className="h-8 w-8 text-violet-600" />
          <span className="text-xl font-bold text-violet-900">Music Diary</span>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-10 px-4 py-20 text-center md:px-6 md:py-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-violet-100 p-6">
              <Music className="h-16 w-16 text-violet-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-violet-900 sm:text-5xl md:text-6xl">my music diary.</h1>
            <p className="max-w-[700px] text-lg text-violet-700 md:text-xl">
              catchphrase idfk
            </p>
          </div>

          <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-violet-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
            Connect to Spotify
          </Link>
        </section>
      </main>
      
    </div>
  )
}
