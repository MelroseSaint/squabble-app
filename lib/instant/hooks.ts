// InstantDB Hooks for Squabble
import { useState, useEffect } from 'react'
import instant from './client'
import { Match, UserProfile, Message, Transaction } from '../../types'

export const useInstant = () => {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      // Initialize InstantDB connection
      await instant.connect()
      setIsReady(true)
      
      // Check authentication status
      const currentUser = await instant.getCurrentUser()
      setUser(currentUser)
    }
    
    init()
    
    return () => {
      // Cleanup on unmount
      instant.disconnect()
    }
  }, [])

  const isAuthenticated = async (): Promise<boolean> => {
    if (!isReady) return false
    const currentUser = await instant.getCurrentUser()
    return !!currentUser
  }

  const getLegalStatus = async (): Promise<boolean> => {
    if (!isReady) return false
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return false
      
      const legal = await instant.query({
        legal: {
          $: {
            where: {
              userId: currentUser.id
            }
          }
        }
      })
      
      return legal.legal?.[0]?.accepted || false
    } catch (error) {
      console.error('Failed to get legal status:', error)
      return false
    }
  }

  const saveLegalStatus = async (accepted: boolean): Promise<void> => {
    if (!isReady) return
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return
      
      await instant.transact([
        {
          legal: {
            $: {
              upsert: {
                userId: currentUser.id,
                accepted: accepted,
                timestamp: Date.now()
              }
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to save legal status:', error)
    }
  }

  const getMatches = async (): Promise<Match[]> => {
    if (!isReady) return []
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return []
      
      const result = await instant.query({
        matches: {
          $: {
            where: {
              userId: currentUser.id
            },
            orderBy: {
              timestamp: 'desc'
            }
          }
        }
      })
      
      return result.matches || []
    } catch (error) {
      console.error('Failed to get matches:', error)
      return []
    }
  }

  const createMatch = async (match: Match): Promise<void> => {
    if (!isReady) return
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return
      
      await instant.transact([
        {
          matches: {
            $: {
              create: {
                ...match,
                userId: currentUser.id
              }
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to create match:', error)
    }
  }

  const updateMatchMessages = async (matchId: string, history: Message[], lastMessage: string): Promise<void> => {
    if (!isReady) return
    
    try {
      await instant.transact([
        {
          matches: {
            $: {
              update: {
                where: { id: matchId },
                set: {
                  history,
                  lastMessage
                }
              }
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to update match messages:', error)
    }
  }

  const deleteMatch = async (matchId: string): Promise<void> => {
    if (!isReady) return
    
    try {
      await instant.transact([
        {
          matches: {
            $: {
              delete: {
                where: { id: matchId }
              }
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to delete match:', error)
    }
  }

  const getUserProfile = async (): Promise<UserProfile> => {
    if (!isReady) return getDefaultProfile()
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return getDefaultProfile()
      
      const result = await instant.query({
        profiles: {
          $: {
            where: {
              userId: currentUser.id
            }
          }
        }
      })
      
      return result.profiles?.[0] || getDefaultProfile()
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return getDefaultProfile()
    }
  }

  const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    if (!isReady) return
    
    try {
      const currentUser = await instant.getCurrentUser()
      if (!currentUser) return
      
      await instant.transact([
        {
          profiles: {
            $: {
              upsert: {
                userId: currentUser.id,
                ...profile
              }
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to save user profile:', error)
    }
  }

  const signout = async (): Promise<void> => {
    if (!isReady) return
    
    try {
      await instant.signOut()
      setUser(null)
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const signin = async (email: string, password: string): Promise<void> => {
    if (!isReady) return
    
    try {
      await instant.signIn({ email, password })
      const currentUser = await instant.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to sign in:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string): Promise<void> => {
    if (!isReady) return
    
    try {
      await instant.signUp({ email, password })
      const currentUser = await instant.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to sign up:', error)
      throw error
    }
  }

  // Helper function to get default profile
  const getDefaultProfile = (): UserProfile => {
    return {
      name: '',
      age: 25,
      height: '5\'10"',
      weight: '170 lbs',
      weightClass: 'Middleweight',
      stance: 'Orthodox',
      experience: 'Amateur',
      bio: 'Fighting enthusiast',
      fightingStyle: 'Mixed',
      wins: 0,
      losses: 0,
      matches: 0,
      isVerified: false,
      trustedContacts: [],
      balance: 0,
      betHistory: [],
      transactions: []
    }
  }

  return {
    isReady,
    user,
    isAuthenticated,
    getLegalStatus,
    saveLegalStatus,
    getMatches,
    createMatch,
    updateMatchMessages,
    deleteMatch,
    getUserProfile,
    saveUserProfile,
    signout,
    signin,
    signup
  }
}