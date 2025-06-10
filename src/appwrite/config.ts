import { Client, Account, Databases, ID, Query } from 'appwrite';

// Appwrite configuration
export const APPWRITE_ENDPOINT = 'https://appwrite.nief.tech/v1';
export const APPWRITE_PROJECT_ID = '67d6ea990025fa097964';
export const APPWRITE_DATABASE_ID = '6842f7e6002342ad02f3';

// Collection IDs
export const COLLECTIONS = {
  SUBJECTS: 'subjects',
  GRADES: 'grades',
  WEIGHT_SETTINGS: 'weight-settings',
};

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };
