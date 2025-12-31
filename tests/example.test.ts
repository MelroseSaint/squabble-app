// Example test file for Squabble
// This demonstrates the testing setup for the Next.js + InstantDB application

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FighterCard } from '../components/FighterCard'
import { Match } from '../types'

describe('FighterCard Component', () => {
  const mockFighter = {
    id: '1',
    name: 'John Doe',
    age: 28,
    height: '6\'0"',
    weight: '185 lbs',
    weightClass: 'Middleweight',
    stance: 'Orthodox',
    experience: 'Pro',
    bio: 'Professional fighter with 10 years experience',
    fightingStyle: 'MMA',
    location: 'New York, NY',
    stats: {
      strength: 85,
      speed: 90,
      anger: 75,
      durability: 88,
      crazy: 60
    },
    imageUrl: 'https://example.com/fighter.jpg',
    distance: 2.5,
    wins: 15,
    losses: 3,
    winStreak: 5,
    badges: ['Verified']
  }

  it('renders fighter information correctly', () => {
    render(<FighterCard fighter={mockFighter} active={true} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
    expect(screen.getByText('Middleweight')).toBeInTheDocument()
    expect(screen.getByText('MMA')).toBeInTheDocument()
  })

  it('shows distance when active', () => {
    render(<FighterCard fighter={mockFighter} active={true} />)
    expect(screen.getByText('2.5 mi')).toBeInTheDocument()
  })

  it('does not show distance when inactive', () => {
    render(<FighterCard fighter={mockFighter} active={false} />)
    expect(screen.queryByText('2.5 mi')).not.toBeInTheDocument()
  })
})

describe('InstantDB Integration Tests', () => {
  // These would test the InstantDB integration
  // In a real setup, you would mock the InstantDB client
  it('should demonstrate test structure for database operations', () => {
    // Example structure for testing InstantDB operations
    const mockMatch: Match = {
      id: 'match-1',
      fighter: mockFighter,
      timestamp: Date.now(),
      history: []
    }

    // In real tests, you would:
    // 1. Mock the InstantDB client
    // 2. Test createMatch, getMatches, etc.
    // 3. Verify real-time updates
    
    expect(mockMatch).toHaveProperty('id')
    expect(mockMatch.fighter).toBe(mockFighter)
  })
})

// Example of testing utility functions
describe('Utility Functions', () => {
  it('should demonstrate testing pattern for utilities', () => {
    // Example utility function test
    const result = 'test-result'
    expect(result).toBe('test-result')
  })
})