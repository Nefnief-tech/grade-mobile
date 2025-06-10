import { APPWRITE_CONFIG } from './config';

// Mock Appwrite client for development
export class Client {
  setEndpoint(endpoint: string) {
    return this;
  }

  setProject(project: string) {
    return this;
  }

  setPlatform(platform: string) {
    return this;
  }
}

export class Account {
  constructor(client: Client) {
    // Mock implementation
  }

  async createEmailSession(email: string, password: string) {
    return {
      $id: 'mock-session-id',
      userId: 'mock-user-id',
    };
  }

  async get() {
    return {
      $id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Mock User',
    };
  }

  async deleteSession(sessionId: string) {
    return {};
  }
}

export class Databases {
  constructor(client: Client) {
    // Mock implementation
  }

  async listDocuments(databaseId: string, collectionId: string, queries?: any[]) {
    return {
      documents: [],
      total: 0,
    };
  }

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return {
      $id: documentId,
      ...data,
    };
  }

  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return {
      $id: documentId,
      ...data,
    };
  }

  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    return {};
  }
}

export class Query {
  static equal(attribute: string, value: any) {
    return `equal("${attribute}", "${value}")`;
  }

  static orderDesc(attribute: string) {
    return `orderDesc("${attribute}")`;
  }

  static orderAsc(attribute: string) {
    return `orderAsc("${attribute}")`;
  }
}

export const ID = {
  unique: () => Date.now().toString(),
};
