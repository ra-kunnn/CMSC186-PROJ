'use client'; // Required for interactivity (onClick, useState, etc.)

import { requestAuthorization } from '@/app/app';

export default function SpotifyAuthButton() {
  const handleClick = () => {
    requestAuthorization(); // Calls your auth function
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex h-11 items-center justify-center rounded-md bg-violet-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
    >
      Connect to Spotify
    </button>
  );
}