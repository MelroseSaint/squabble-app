// Next.js Entry Point - This file is now handled by app/layout.tsx and app/page.tsx
// Keeping this file for compatibility during migration

import React from 'react'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold text-center pt-20">Squabble Web App</h1>
      <p className="text-center mt-4">Loading...</p>
    </div>
  )
}

export default App