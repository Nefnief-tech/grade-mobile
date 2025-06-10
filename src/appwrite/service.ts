import { ID, Query } from 'appwrite';
import { account, databases, APPWRITE_DATABASE_ID, COLLECTIONS } from './config';
import { Subject, Grade, WeightSetting } from '../types';

class AppwriteService {
  // Auth methods
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.log('No active session');
      return null;
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async registerWithEmail(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await this.loginWithEmail(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  // Subject methods
  async createSubject(subject: Pick<Subject, 'name' | 'color'>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.SUBJECTS,
        ID.unique(),
        {
          ...subject,
          userId: user.$id,
        }
      );

      return response as unknown as Subject;
    } catch (error: any) {
      console.error('Create subject error:', error);
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        throw new Error('Database collections not set up. Please contact support.');
      }
      throw error;
    }
  }

  async getSubjects(): Promise<Subject[]> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.SUBJECTS,
        [Query.equal('userId', user.$id)]
      );

      return response.documents as unknown as Subject[];
    } catch (error: any) {
      console.error('Get subjects error:', error);
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        console.warn('Subjects collection not found, returning empty array');
        return [];
      }
      throw error;
    }
  }

  async updateSubject(subjectId: string, updates: Partial<Omit<Subject, '$id' | 'id' | 'userId'>>) {
    try {
      const document = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.SUBJECTS,
        subjectId,
        updates
      );

      return {
        $id: document.$id,
        id: document.$id,
        name: document.name,
        color: document.color,
        userId: document.userId,
      } as Subject;
    } catch (error) {
      console.error('Update subject error:', error);
      throw error;
    }
  }

  async deleteSubject(subjectId: string) {
    try {
      // First delete all grades for this subject
      const grades = await this.getGradesBySubject(subjectId);
      await Promise.all(grades.map(grade => this.deleteGrade(grade.$id)));

      // Then delete the subject
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.SUBJECTS,
        subjectId
      );
    } catch (error) {
      console.error('Delete subject error:', error);
      throw error;
    }
  }
  // Grade methods
  async createGrade(grade: Omit<Grade, '$id' | 'id' | 'userId'>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const document = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.GRADES,
        ID.unique(),
        {
          ...grade,
          userId: user.$id,
        }
      );

      return {
        $id: document.$id,
        id: document.$id,
        subjectId: document.subjectId,
        type: document.type,
        value: document.value,
        weight: document.weight,
        semester: document.semester,
        date: document.date,
        userId: document.userId,
      } as Grade;
    } catch (error) {
      console.error('Create grade error:', error);
      throw error;
    }
  }

  async getGrades(): Promise<Grade[]> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return [];

      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.GRADES,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('date')
        ]
      );

      return response.documents.map(doc => ({
        $id: doc.$id,
        id: doc.$id,
        subjectId: doc.subjectId,
        type: doc.type,
        value: doc.value,
        weight: doc.weight,
        semester: doc.semester,
        date: doc.date,
        userId: doc.userId,
      })) as Grade[];
    } catch (error) {
      console.error('Get grades error:', error);
      return [];
    }
  }

  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return [];

      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.GRADES,
        [
          Query.equal('userId', user.$id),
          Query.equal('subjectId', subjectId),
          Query.orderDesc('date')
        ]
      );

      return response.documents.map(doc => ({
        $id: doc.$id,
        id: doc.$id,
        subjectId: doc.subjectId,
        type: doc.type,
        value: doc.value,
        weight: doc.weight,
        semester: doc.semester,
        date: doc.date,
        userId: doc.userId,
      })) as Grade[];
    } catch (error) {
      console.error('Get grades by subject error:', error);
      return [];
    }
  }

  async updateGrade(gradeId: string, updates: Partial<Omit<Grade, '$id' | 'id' | 'userId'>>) {
    try {
      const document = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.GRADES,
        gradeId,
        updates
      );

      return {
        $id: document.$id,
        id: document.$id,
        subjectId: document.subjectId,
        type: document.type,
        value: document.value,
        weight: document.weight,
        semester: document.semester,
        date: document.date,
        userId: document.userId,
      } as Grade;
    } catch (error) {
      console.error('Update grade error:', error);
      throw error;
    }
  }

  async deleteGrade(gradeId: string) {
    try {
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.GRADES,
        gradeId
      );
    } catch (error) {
      console.error('Delete grade error:', error);
      throw error;
    }
  }
  // Weight settings methods
  async createWeightSetting(setting: Omit<WeightSetting, '$id' | 'id' | 'userId'>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const document = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.WEIGHT_SETTINGS,
        ID.unique(),
        {
          ...setting,
          userId: user.$id,
        }
      );

      return {
        $id: document.$id,
        id: document.$id,
        subjectId: document.subjectId,
        gradeType: document.gradeType,
        weight: document.weight,
        userId: document.userId,
      } as WeightSetting;
    } catch (error) {
      console.error('Create weight setting error:', error);
      throw error;
    }
  }

  async getWeightSettings(): Promise<WeightSetting[]> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return [];

      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.WEIGHT_SETTINGS,
        [Query.equal('userId', user.$id)]
      );

      return response.documents.map(doc => ({
        $id: doc.$id,
        id: doc.$id,
        subjectId: doc.subjectId,
        gradeType: doc.gradeType,
        weight: doc.weight,
        userId: doc.userId,
      })) as WeightSetting[];
    } catch (error) {
      console.error('Get weight settings error:', error);
      return [];
    }
  }

  async updateWeightSetting(settingId: string, updates: Partial<Omit<WeightSetting, '$id' | 'id' | 'userId'>>) {
    try {
      const document = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.WEIGHT_SETTINGS,
        settingId,
        updates
      );

      return {
        $id: document.$id,
        id: document.$id,
        subjectId: document.subjectId,
        gradeType: document.gradeType,
        weight: document.weight,
        userId: document.userId,
      } as WeightSetting;
    } catch (error) {
      console.error('Update weight setting error:', error);
      throw error;
    }
  }

  async deleteWeightSetting(settingId: string) {
    try {
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.WEIGHT_SETTINGS,
        settingId
      );
    } catch (error) {
      console.error('Delete weight setting error:', error);
      throw error;
    }
  }
}

export default new AppwriteService();