'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { View } from '../../types'
import { LoginView } from '../../components/LoginView'
import { SwipeView } from '../../components/SwipeView'
import { MatchList } from '../../components/MatchList'
import { ChatInterface } from '../../components/ChatInterface'
import { ProfileView } from '../../components/ProfileView'
import { MapView } from '../../components/MapView'
import { SettingsView } from '../../components/SettingsView'
import { AnalyticsView } from '../../components/AnalyticsView'
import { SafetyCenter } from '../../components/SafetyCenter'
import { FadeDuelView } from '../../components/FadeDuelView'
import { OnlyFightsPromo } from '../../components/OnlyFightsPromo'
import { FightingStylesView } from '../../components/FightingStylesView'
import { PaymentModal } from '../../components/PaymentModal'
import { Toast } from '../../components/Toast'
import { Flame, MessageCircle, User, X, Check, Wifi, WifiOff, Map as MapIcon, ShieldAlert, DollarSign } from 'lucide-react'
import { useInstant } from '../../lib/instant/hooks'
import { Fighter, Match, UserProfile, Notification, Message, Transaction } from '../../types'

export default function HomePage() {
  // App State
  const [legalAccepted, setLegalAccepted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState<View>(View.SWIPE)
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [apiKey, setApiKey] = useState<string>('')
  const [matches, setMatches] = useState<Match[]>([])
  const [isCloudStorage, setIsCloudStorage] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newMatch, setNewMatch] = useState<Match | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showSafetyCenter, setShowSafetyCenter] = useState(false)
  const [showDuck, setShowDuck] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  
  const router = useRouter()
  const { isAuthenticated, getLegalStatus, saveLegalStatus, getMatches, createMatch, updateMatchMessages, deleteMatch, getUserProfile, saveUserProfile, signout } = useInstant()

  // Initialize data
  useEffect(() => {
    const initialize = async () => {
      // Check Legal
      const hasAccepted = await getLegalStatus()
      setLegalAccepted(hasAccepted)
      
      // Check Auth
      const loggedIn = await isAuthenticated()
      setIsLoggedIn(loggedIn)
      
      // Load Data
      const savedMatches = await getMatches()
      setMatches(savedMatches)
      
      const profile = await getUserProfile()
      setUserProfile(profile)
      
      // Set cloud storage status
      setIsCloudStorage(true) // InstantDB is always cloud-based
    }
    initialize()
  }, [])

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ id: Date.now().toString(), message, type })
  }

  const handleAcceptLegal = () => {
    saveLegalStatus(true)
    setLegalAccepted(true)
  }

  const handleUpdateMatch = async (matchId: string, history: Message[], lastMessage: string) => {
    // Optimistic update for UI
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, history, lastMessage }
        : m
    ))

    // Update selected match if active
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => prev ? { ...prev, history, lastMessage } : null)
    }

    // Persist to InstantDB
    await updateMatchMessages(matchId, history, lastMessage)
  }

  const handleDeleteMatch = async (matchId: string) => {
    // Optimistic UI update
    setMatches(prev => prev.filter(m => m.id !== matchId))

    // Clear selected match if it was deleted
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(null)
    }

    // DB Update
    await deleteMatch(matchId)
  }

  const handleSaveStyle = async (style: string) => {
    if (userProfile) {
      const updated = { ...userProfile, fightingStyle: style }
      setUserProfile(updated)
      await saveUserProfile(updated)
      setCurrentView(View.PROFILE)
      notify(`Fighting style updated to ${style}`, 'success')
    }
  }

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile)
    await saveUserProfile(updatedProfile)
  }

  const handleAddFunds = async (amount: number) => {
    if (userProfile) {
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'DEPOSIT',
        amount: amount,
        timestamp: Date.now(),
        status: 'COMPLETED',
        description: 'Wallet Top-Up via Stripe'
      }

      const updatedProfile = {
        ...userProfile,
        balance: userProfile.balance + amount,
        transactions: [newTx, ...(userProfile.transactions || [])]
      }

      setUserProfile(updatedProfile)
      await saveUserProfile(updatedProfile)
      notify(`$${amount} added to wallet successfully!`, 'success')
    }
  }

  const handleKeyUpdate = (key: string) => {
    setApiKey(key)
  }

  const handleLogout = async () => {
    await signout()
    setIsLoggedIn(false)
    setCurrentView(View.SWIPE)
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= fighters.length) return

    if (direction === 'left') {
      // Show Duck Animation for "Ducking" the fight
      setShowDuck(true)
      setTimeout(() => setShowDuck(false), 1200)
    }

    if (direction === 'right') {
      const fighter = fighters[currentIndex]
      // 50% chance they swipe back immediately for demo purposes
      const isMatch = Math.random() > 0.2

      if (isMatch) {
        const matchData: Match = {
          id: Date.now().toString(),
          fighter: fighter,
          timestamp: Date.now(),
          history: []
        }

        // Update State
        setMatches(prev => [matchData, ...prev])
        setNewMatch(matchData)

        // Save to InstantDB
        await createMatch(matchData)
      }
    }

    setCurrentIndex(prev => prev + 1)
  }

  // If user hasn't accepted terms, show modal
  if (!legalAccepted) {
    return <LegalModal onAccept={handleAcceptLegal} />
  }

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  // Render content based on view
  const renderContent = () => {
    switch (currentView) {
      case View.SWIPE:
        return (
          <SwipeView
            fighters={fighters}
            currentIndex={currentIndex}
            isLoading={isLoading}
            newMatch={newMatch}
            showDuck={showDuck}
            isCloudStorage={isCloudStorage}
            onSwipe={handleSwipe}
            onCloseNewMatch={() => setNewMatch(null)}
            onChat={() => {
              if (newMatch) {
                setSelectedMatch(newMatch)
                setNewMatch(null)
                setCurrentView(View.CHAT)
              }
            }}
          />
        )

      case View.MATCHES:
        return (
          <MatchList
            matches={matches}
            onSelectMatch={(m) => {
              setSelectedMatch(m)
              setCurrentView(View.CHAT)
            }}
            onDeleteMatch={handleDeleteMatch}
          />
        )

      case View.CHAT:
        if (!selectedMatch) return null
        return (
          <ChatInterface
            match={selectedMatch}
            apiKey={apiKey}
            onBack={() => {
              setSelectedMatch(null)
              setCurrentView(View.MATCHES)
            }}
            onUpdateMatch={handleUpdateMatch}
            onUnmatch={handleDeleteMatch}
            notify={notify}
          />
        )

      case View.PROFILE:
        return userProfile ? (
          <ProfileView
            userProfile={userProfile}
            onEditStyle={() => setCurrentView(View.STYLES)}
            onOpenSettings={() => setCurrentView(View.SETTINGS)}
            onViewAnalytics={() => setCurrentView(View.ANALYTICS)}
          />
        ) : <div>Loading...</div>

      case View.STYLES:
        return userProfile ? (
          <FightingStylesView
            currentStyle={userProfile.fightingStyle}
            onSelectStyle={handleSaveStyle}
            onBack={() => setCurrentView(View.PROFILE)}
          />
        ) : null

      case View.SETTINGS:
        return (
          <SettingsView
            onBack={() => {
              // Reload profile to reflect changes
              getUserProfile().then(setUserProfile)
              setCurrentView(View.PROFILE)
            }}
            onSaveKey={handleKeyUpdate}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
            onLogout={handleLogout}
          />
        )

      case View.ANALYTICS:
        return userProfile ? (
          <AnalyticsView
            userProfile={userProfile}
            onBack={() => setCurrentView(View.PROFILE)}
          />
        ) : null

      case View.ONLYFIGHTS:
        return <OnlyFightsPromo />

      case View.MAP:
        return (
          <MapView
            fighters={fighters}
            onSelectFighter={(f) => setSelectedFighter(f)}
          />
        )

      case View.FADE_DUEL:
        return userProfile ? (
          <FadeDuelView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setCurrentView(View.SWIPE)}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
          />
        ) : null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-4">

        {/* Global Notifications */}
        {notification && (
          <Toast notification={notification} onClose={() => setNotification(null)} />
        )}

        {/* Global Safety Shield */}
        <button
          onClick={() => setShowSafetyCenter(true)}
          className="absolute top-4 left-4 z-[60] bg-red-900/80 hover:bg-red-700 text-white p-2 rounded-full border border-red-500 shadow-lg shadow-red-900/50 backdrop-blur-sm transition-transform hover:scale-105"
          title="Emergency Safety Center"
        >
          <ShieldAlert size={20} className="animate-pulse" />
        </button>

        {/* Map Selection Modal */}
        {selectedFighter && (
          <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm p-8 flex items-center justify-center" onClick={() => setSelectedFighter(null)}>
            <div className="relative w-full aspect-[3/4] max-w-sm bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-squabble-red" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedFighter(null)} className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1"><X size={24} /></button>
              <FighterCard fighter={selectedFighter} active={true} />
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={handleAddFunds}
          />
        )}

        {/* Safety Modal */}
        {showSafetyCenter && <SafetyCenter onClose={() => setShowSafetyCenter(false)} />}

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        {(currentView !== View.CHAT && currentView !== View.STYLES && currentView !== View.SETTINGS && currentView !== View.ANALYTICS && currentView !== View.FADE_DUEL) && (
          <div className="h-16 bg-squabble-dark border-t border-gray-800 flex items-center justify-around px-2 z-50 mt-6 rounded-lg">
            <button
              onClick={() => setCurrentView(View.SWIPE)}
              className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.SWIPE ? 'text-squabble-red' : 'text-gray-500'}`}
            >
              <Flame size={20} />
            </button>
            <button
              onClick={() => setCurrentView(View.MAP)}
              className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.MAP ? 'text-squabble-red' : 'text-gray-500'}`}
            >
              <MapIcon size={20} />
            </button>

            {/* Fade Duel Button */}
            <button
              onClick={() => setCurrentView(View.FADE_DUEL)}
              className="flex flex-col items-center justify-center w-12 h-full text-gray-500 hover:text-green-500 transition-colors"
            >
              <DollarSign size={20} />
            </button>

            <button
              onClick={() => setCurrentView(View.MATCHES)}
              className={`flex flex-col items-center justify-center w-12 h-full relative ${currentView === View.MATCHES ? 'text-squabble-red' : 'text-gray-500'}`}
            >
              <MessageCircle size={20} />
              {matches.length > 0 && (
                <span className="absolute top-3 right-2 w-2 h-2 bg-squabble-red rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setCurrentView(View.PROFILE)}
              className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.PROFILE ? 'text-squabble-red' : 'text-gray-500'}`}
            >
              <User size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}