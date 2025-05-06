import Link from "next/link"
import { Music } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 to-white">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Music className="h-8 w-8 text-violet-600" />
          <span className="text-xl font-bold text-violet-900">my music diary.</span>
        </div>
        <Link
          href="../"
          className="inline-flex h-10 items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          Log Out
        </Link>
      </header>
    </div>

    
  )
}
