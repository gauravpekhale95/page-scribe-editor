import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DocumentStatus = 'new' | 'in-progress' | 'review' | 'complete' | 'ai-process';

export interface User {
  id: string;
  email: string;
  role: string;
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

  // Data loader
  loadMockData: () => Promise<void>;
}

// Dummy API functions returning mock data (simulate future API calls)

const fetchUser = async (): Promise<User> => ({
  id: 'user-1',
  email: 'user@example.com',
  role: 'cca',
  states: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
  name: 'John Doe'
});

const fetchStates = async (): Promise<string[]> => ['California', 'Texas', 'New York', 'Florida', 'Illinois'];

const fetchDocuments = async (): Promise<Document[]> => {
  const states = await fetchStates();
  const statuses: DocumentStatus[] = ['new', 'in-progress', 'review', 'complete', 'ai-process'];

  return states.flatMap(state =>
    Array(3).fill(0).map((_, i) => ({
      id: `doc-${state}-${i}`,
      name: `${state} Form ${i + 1}`,
      state,
      versionsCount: Math.floor(Math.random() * 5) + 1,
      lastEdited: new Date().toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }))
  );
};

const fetchVersions = async (documents: Document[]): Promise<Version[]> => {
  const statuses: DocumentStatus[] = ['new', 'in-progress', 'review', 'complete', 'ai-process'];

  return documents.flatMap(doc =>
    Array(doc.versionsCount).fill(0).map((_, i) => ({
      id: `version-${doc.id}-${i}`,
      documentId: doc.id,
      versionNumber: i + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  );
};

const fetchPages = async (versions: Version[]): Promise<Page[]> => {
  return versions.flatMap(version =>
    Array(3).fill(0).map((_, i) => ({
      id: `page-${version.id}-${i}`,
      versionId: version.id,
      pageNumber: i + 1,
      imageUrl: '/placeholder.svg',
      json: { fields: [{ name: `field${i+1}`, type: 'text', label: `Field ${i+1}` }] },
      validationRules: Array(2).fill(0).map((_, j) => ({
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

      loadMockData: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await fetchUser();
          const states = await fetchStates();
          const documents = await fetchDocuments();
          const versions = await fetchVersions(documents);
          const pages = await fetchPages(versions);

          set({
            user,
            states,
            documents,
            versions,
            pages,
            isLoading: false
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      }
    }),
    {
      name: 'document-app-storage'
    }
  )
);
