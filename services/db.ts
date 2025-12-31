// Updated Database Service using InstantDB
import instant from '../lib/instant/client'
import { Match, UserProfile, Message } from '../types'

// Initialize InstantDB connection
let isInitialized = false

export const initDB = async (): Promise<boolean> => {
  if (isInitialized) return true
  
  try {
    await instant.connect()
    isInitialized = true
    return true
  } catch (error) {
    console.error('InstantDB initialization failed:', error)
    return false
  }
}

export const signin = async (email: string, password: string): Promise<void> => {
  if (!isInitialized) await initDB()
  
  try {
    await instant.signIn({ email, password })
  } catch (e) {
    console.error("Signin failed", e)
    throw e
  }
}

export const signup = async (email: string, password: string): Promise<void> => {
  if (!isInitialized) await initDB()
  
  try {
    await instant.signUp({ email, password })
  } catch (e) {
    console.error("Signup failed", e)
    throw e
  }
}

export const signout = async (): Promise<void> => {
  try {
    await instant.signOut()
  } catch (e) {
    console.error("Signout failed", e)
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await instant.getCurrentUser()
    return !!user
  } catch (e) {
    console.error("Auth check failed", e)
    return false
  }
}

export const getMatches = async (): Promise<Match[]> => {
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

export const createMatch = async (match: Match): Promise<void> => {
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

export const updateMatchMessages = async (matchId: string, history: Message[], lastMessage: string): Promise<void> => {
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

export const deleteMatch = async (matchId: string): Promise<void> => {
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

export const getUserProfile = async (): Promise<UserProfile> => {
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

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
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

export const getLegalStatus = async (): Promise<boolean> => {
  try {
    const currentUser = await instant.getCurrentUser()
    if (!currentUser) return false
    
    const result = await instant.query({
      legal: {
        $: {
          where: {
            userId: currentUser.id
          }
        }
      }
    })
    
    return result.legal?.[0]?.accepted || false
  } catch (error) {
    console.error('Failed to get legal status:', error)
    return false
  }
}

export const saveLegalStatus = async (accepted: boolean): Promise<void> => {
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

export default {
  initDB,
  getMatches,
  createMatch,
  updateMatchMessages,
  deleteMatch,
  getUserProfile,
  saveUserProfile,
  getLegalStatus,
  saveLegalStatus,
  signin,
  signup,
  signout,
  isAuthenticated
}