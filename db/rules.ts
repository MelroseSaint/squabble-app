// InstantDB Rules for Squabble
// Access control and validation rules

export const rules = {
  // Match rules - only authenticated users can create/update/delete their own matches
  matches: {
    create: 'auth != null',
    read: 'auth != null',
    update: 'auth != null && auth.id == this.userId',
    delete: 'auth != null && auth.id == this.userId'
  },
  
  // User rules - strict access control
  users: {
    create: 'auth == null', // Allow signup
    read: 'auth != null && auth.id == this.id', // Only read own user data
    update: 'auth != null && auth.id == this.id', // Only update own user data
    delete: 'auth != null && auth.id == this.id' // Only delete own user data
  },
  
  // Profile rules - only authenticated users can access their own profiles
  profiles: {
    create: 'auth != null',
    read: 'auth != null && auth.id == this.userId',
    update: 'auth != null && auth.id == this.userId',
    delete: 'auth != null && auth.id == this.userId'
  },
  
  // Message rules - only match participants can read messages
  messages: {
    create: 'auth != null',
    read: 'auth != null',
    update: 'auth != null && auth.id == this.sender',
    delete: 'auth != null && auth.id == this.sender'
  },
  
  // Legal rules - only authenticated users can update their legal status
  legal: {
    create: 'auth != null',
    read: 'auth != null && auth.id == this.userId',
    update: 'auth != null && auth.id == this.userId',
    delete: 'auth != null && auth.id == this.userId'
  }
};