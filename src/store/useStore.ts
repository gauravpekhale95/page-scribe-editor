
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'dev' | 'cca';
export type DocumentStatus = 'new' | 'in-progress' | 'review' | 'complete' | 'ai-process';

export interface User {
  email: string;
  role: Role;
  states: string[];
  name: string;
}

export interface Document {
  id: string;
  name: string;
  state: string;
  versionsCount: number;
  lastEdited: string;
  status: DocumentStatus;
}

export interface Version {
  id: string;
  documentId: string;
  versionNumber: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  versionId: string;
  pageNumber: number;
  imageUrl: string;
  json: any;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  pageId: string;
  description: string;
  field: string;
  rule: string;
}

interface AppState {
  user: User | null;
  states: string[];
  documents: Document[];
  versions: Version[];
  pages: Page[];
  currentState: string | null;
  currentDocument: string | null;
  currentVersion: string | null;
  currentPage: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setStates: (states: string[]) => void;
  setDocuments: (documents: Document[]) => void;
  setVersions: (versions: Version[]) => void;
  setPages: (pages: Page[]) => void;
  setCurrentState: (state: string | null) => void;
  setCurrentDocument: (documentId: string | null) => void;
  setCurrentVersion: (versionId: string | null) => void;
  setCurrentPage: (pageId: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Mock data helpers (for development)
  loadMockData: () => void;
}

// Mock data for development
const mockStates = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];

const createMockDocuments = () => {
  const statuses: DocumentStatus[] = ['new', 'in-progress', 'review', 'complete', 'ai-process'];
  
  return mockStates.flatMap(state => 
    Array(3).fill(0).map((_, i) => ({
      id: `doc-${state}-${i}`,
      name: `${state} Form ${i + 1}`,
      state,
      versionsCount: Math.floor(Math.random() * 5) + 1,
      lastEdited: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }))
  );
};

const createMockVersions = (documents: Document[]) => {
  const statuses: DocumentStatus[] = ['new', 'in-progress', 'review', 'complete', 'ai-process'];
  
  return documents.flatMap(doc => 
    Array(doc.versionsCount).fill(0).map((_, i) => ({
      id: `version-${doc.id}-${i}`,
      documentId: doc.id,
      versionNumber: i + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
    }))
  );
};

const createMockPages = (versions: Version[]) => {
  return versions.flatMap(version => 
    Array(Math.floor(Math.random() * 5) + 1).fill(0).map((_, i) => ({
      id: `page-${version.id}-${i}`,
      versionId: version.id,
      pageNumber: i + 1,
      imageUrl: '/placeholder.svg',
      json: { fields: [{ name: `field${i+1}`, type: 'text', label: `Field ${i+1}` }] },
      validationRules: Array(Math.floor(Math.random() * 3) + 1).fill(0).map((_, j) => ({
        id: `rule-${version.id}-${i}-${j}`,
        pageId: `page-${version.id}-${i}`,
        description: `Validate Field ${i+1}`,
        field: `field${i+1}`,
        rule: `length > ${j+1}`
      }))
    }))
  );
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      states: [],
      documents: [],
      versions: [],
      pages: [],
      currentState: null,
      currentDocument: null,
      currentVersion: null,
      currentPage: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setStates: (states) => set({ states }),
      setDocuments: (documents) => set({ documents }),
      setVersions: (versions) => set({ versions }),
      setPages: (pages) => set({ pages }),
      setCurrentState: (currentState) => set({ currentState }),
      setCurrentDocument: (currentDocument) => set({ currentDocument }),
      setCurrentVersion: (currentVersion) => set({ currentVersion }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      loadMockData: () => {
        const mockDocs = createMockDocuments();
        const mockVersions = createMockVersions(mockDocs);
        const mockPages = createMockPages(mockVersions);

        set({
          user: {
            email: 'user@example.com',
            role: 'cca',
            states: mockStates,
            name: 'John Doe'
          },
          states: mockStates,
          documents: mockDocs,
          versions: mockVersions,
          pages: mockPages
        });
      }
    }),
    {
      name: 'document-app-storage'
    }
  )
);
