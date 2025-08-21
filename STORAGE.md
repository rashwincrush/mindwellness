# Local Storage Implementation Documentation

## Overview

TaskMasterPro uses a file-based persistence layer for the in-memory database to ensure data is preserved across server restarts. This implementation provides a lightweight alternative to external databases while maintaining full functionality for development and demo purposes.

## Implementation Details

### Storage Architecture

The system uses a hybrid approach:
- In-memory storage for fast access during runtime
- JSON file persistence to disk for data durability

### Key Components

1. **Storage Class** (`server/storage.ts`):
   - Manages all CRUD operations for application data
   - Automatically persists changes to disk
   - Loads data from disk on server startup

2. **Persistence Methods**:
   - `loadFromFile()` - Loads data from disk at server startup
   - `saveToFile()` - Saves in-memory data to disk
   - Automatic saving triggered after all CRUD operations

3. **Data File Location**:
   - Path: `data/app-data.json`
   - Format: JSON structure with collections for each entity type

4. **Auto-Save Mechanisms**:
   - On process exit (using Node.js process events)
   - After every CRUD operation
   - Periodic auto-save every 5 minutes

### Data Collections

The storage system manages the following collections:
- `users` - User accounts and profile information
- `moodCheckins` - Student mood check-in records
- `anonymousReports` - Anonymous reports from students
- `panicAlerts` - Emergency panic button alerts
- `wellnessCases` - Student wellness case records
- `counselorNotes` - Notes from counselors on cases
- `chatMessages` - AI assistant chat history
- `parentNotifications` - Notifications for parents
- `emergencyAlerts` - School-wide emergency alerts
- `counselorAlerts` - Alerts for counselors

## Usage Examples

### Loading Data at Server Start

```typescript
// In server/storage.ts
constructor() {
  // Initialize data structures
  this.users = {};
  this.moodCheckins = {};
  // ... other collections
  
  // Load data from file if it exists
  this.loadFromFile();
  
  // Set up auto-save
  this.setupAutoSave();
}
```

### Saving Data After Operations

```typescript
// Example: Creating a user
createUser(userData) {
  // Create user in memory
  const user = {
    id: this.generateId(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  this.users[user.id] = user;
  
  // Persist to file
  this.saveToFile();
  
  return user;
}
```

### Client-Side Integration

The React client components interact with the persistence layer through API endpoints, which trigger the appropriate storage methods. The AuthContext has been updated to manage user state and persist changes to local storage on the client-side.

## Benefits and Limitations

### Benefits
- Simple implementation without external dependencies
- Ideal for development and demo environments
- Full data persistence across server restarts
- Easy to debug and inspect data (plain JSON file)

### Limitations
- Not suitable for production with multiple users/high load
- No built-in data validation beyond TypeScript types
- Limited query capabilities compared to a real database

## Future Enhancements

- Add data validation schemas
- Implement transaction support
- Add more sophisticated query capabilities
- Optional migration path to a "real" database
