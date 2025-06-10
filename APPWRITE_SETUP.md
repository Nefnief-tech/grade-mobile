# Appwrite Configuration Guide

## Setup Instructions

1. **Create an Appwrite Project**
   - Go to [Appwrite Cloud](https://cloud.appwrite.io) or set up a self-hosted instance
   - Create a new project
   - Note down your Project ID

2. **Create a Database**
   - In your Appwrite console, go to Databases
   - Create a new database called "grade_tracker"
   - Note down the Database ID

3. **Create Collections**

   ### Subjects Collection
   - Collection ID: `subjects`
   - Attributes:
     - `name` (string, required, size: 255)
     - `color` (string, required, size: 7) 
     - `userId` (string, required, size: 255)
   
   ### Grades Collection  
   - Collection ID: `grades`
   - Attributes:
     - `subjectId` (string, required, size: 255)
     - `type` (string, required, size: 50)
     - `value` (double, required, min: 1.0, max: 6.0)
     - `weight` (double, required, min: 0.1, max: 1.0)
     - `semester` (string, required, size: 20)
     - `date` (string, required, size: 50)
     - `userId` (string, required, size: 255)

   ### WeightSettings Collection
   - Collection ID: `weight_settings`
   - Attributes:
     - `subjectId` (string, required, size: 255)
     - `gradeType` (string, required, size: 50)
     - `weight` (double, required, min: 0.1, max: 1.0)
     - `userId` (string, required, size: 255)

4. **Configure Permissions**
   - For each collection, set permissions to:
     - Create: Users
     - Read: User:{userId}
     - Update: User:{userId}  
     - Delete: User:{userId}

5. **Update Configuration**
   - Copy your Project ID, Database ID, and Collection IDs
   - Update `src/appwrite/config.ts` with your values:

   ```typescript
   export const APPWRITE_CONFIG = {
     endpoint: 'https://cloud.appwrite.io/v1', // or your self-hosted URL
     projectId: 'YOUR_PROJECT_ID',
     databaseId: 'YOUR_DATABASE_ID',
     collections: {
       subjects: 'subjects',
       grades: 'grades', 
       weightSettings: 'weight_settings'
     }
   };
   ```

6. **Test Connection**
   - Run the app and try to register a new user
   - If successful, you should be able to add subjects and grades

## Security Notes

- Document-level permissions ensure users can only access their own data
- All operations include userId filters for additional security
- Consider setting up rate limits in production
- Enable audit logs for monitoring data access

## Troubleshooting

- **Connection Issues**: Check your endpoint URL and project ID
- **Permission Errors**: Verify collection permissions are set correctly  
- **Attribute Errors**: Ensure all attributes match the schema exactly
- **Network Issues**: Check your internet connection and Appwrite service status

# Appwrite Database Setup Guide

## Database Configuration
- **Database ID**: `6842f7e6002342ad02f3`
- **Project ID**: `67d6ea990025fa097964`
- **Endpoint**: `https://appwrite.nief.tech/v1`

## Required Collections

### 1. Subjects Collection
- **Collection ID**: `subjects`
- **Attributes**:
  - `name` (String, required, size: 255)
  - `color` (String, required, size: 7)
  - `userId` (String, required, size: 255)

### 2. Grades Collection
- **Collection ID**: `grades`
- **Attributes**:
  - `subjectId` (String, required, size: 255)
  - `type` (String, required, size: 50)
  - `value` (Float, required)
  - `weight` (Float, required)
  - `semester` (String, required, size: 20)
  - `date` (DateTime, required)
  - `userId` (String, required, size: 255)

### 3. Weight Settings Collection
- **Collection ID**: `weight-settings`
- **Attributes**:
  - `subjectId` (String, required, size: 255)
  - `gradeType` (String, required, size: 50)
  - `weight` (Float, required)
  - `userId` (String, required, size: 255)

## Permissions Setup
For each collection, add these permissions:
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

## Indexes (Optional but Recommended)
1. **subjects**: Index on `userId`
2. **grades**: Index on `userId` and `subjectId`
3. **weight-settings**: Index on `userId` and `subjectId`

## Setup Steps
1. Go to your Appwrite Console
2. Navigate to Database → Collections
3. Create each collection with the specified attributes
4. Set permissions for authenticated users
5. Test the connection by creating a subject

## Troubleshooting
- Ensure collection IDs match exactly (case-sensitive)
- Verify all attributes are created with correct types
- Check that user authentication is working
- Confirm database ID is correct in the app configuration
