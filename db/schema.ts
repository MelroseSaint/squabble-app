// InstantDB Schema Definition for Squabble

export const schema = {
  matches: {
    id: 'string',
    fighter: 'object',
    timestamp: 'number',
    lastMessage: 'string',
    history: 'array'
  },
  users: {
    id: 'string',
    username: 'string',
    email: 'string',
    password: 'string',
    createdAt: 'number'
  },
  profiles: {
    userId: 'string',
    name: 'string',
    age: 'number',
    height: 'string',
    weight: 'string',
    weightClass: 'string',
    stance: 'string',
    experience: 'string',
    bio: 'string',
    fightingStyle: 'string',
    wins: 'number',
    losses: 'number',
    matches: 'number',
    isVerified: 'boolean',
    balance: 'number'
  },
  messages: {
    id: 'string',
    matchId: 'string',
    sender: 'string',
    text: 'string',
    timestamp: 'number'
  },
  legal: {
    userId: 'string',
    accepted: 'boolean',
    timestamp: 'number'
  }
};