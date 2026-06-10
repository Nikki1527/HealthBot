import { MedicalSummary } from '@/components/SummaryCard';

// Simulate a local server for storing and retrieving medical records
class MockLocalServer {
  private static instance: MockLocalServer;
  private storage: Map<string, MedicalSummary>;
  
  private constructor() {
    this.storage = new Map();
    
    // Initialize with local storage data if available
    const storedData = localStorage.getItem('healthscribe_nfts'); // Keep key name for compatibility or migration
    if (storedData) {
      const parsedData = JSON.parse(storedData) as MedicalSummary[];
      parsedData.forEach(summary => {
        // Upgrade legacy 'minted' status to 'saved'
        if ((summary.status as string) === 'minted') {
          summary.status = 'saved';
        }
        this.storage.set(summary.id, summary);
      });
    } else {
      // Pre-populate with default summaries if local storage is empty
      const defaultSummaries: MedicalSummary[] = [
        {
          id: '1',
          date: 'April 10, 2025',
          title: 'Cold & Flu Symptoms',
          description: 'Patient reported headache, sore throat, and fatigue lasting 2 days.',
          symptoms: ['Headache', 'Sore throat', 'Fatigue'],
          recommendation: 'Rest, hydration, and over-the-counter pain relievers recommended. Monitor for fever development.',
          severity: 'low',
          status: 'saved',
          savedAt: new Date('2025-04-10T10:00:00Z').toISOString()
        },
        {
          id: '2',
          date: 'March 25, 2025',
          title: 'Back Pain Assessment',
          description: 'Patient reported lower back pain that worsens with prolonged sitting.',
          symptoms: ['Lower back pain', 'Stiffness', 'Pain when bending'],
          recommendation: 'Apply heat/ice, gentle stretching exercises, and consider over-the-counter anti-inflammatory medication.',
          severity: 'medium',
          status: 'pending'
        },
        {
          id: '3',
          date: 'March 12, 2025',
          title: 'Allergy Symptoms',
          description: 'Patient reported seasonal allergy symptoms including itchy eyes and congestion.',
          symptoms: ['Itchy eyes', 'Nasal congestion', 'Sneezing'],
          recommendation: 'Try over-the-counter antihistamines and avoid known allergens when possible.',
          severity: 'low',
          status: 'pending'
        }
      ];
      defaultSummaries.forEach(summary => {
        this.storage.set(summary.id, summary);
      });
      this.persistToLocalStorage();
    }
  }
  
  public static getInstance(): MockLocalServer {
    if (!MockLocalServer.instance) {
      MockLocalServer.instance = new MockLocalServer();
    }
    return MockLocalServer.instance;
  }
  
  // Save summary to "server" (localStorage)
  public async saveSummary(summary: MedicalSummary): Promise<MedicalSummary> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        this.storage.set(summary.id, summary);
        this.persistToLocalStorage();
        resolve(summary);
      }, 500);
    });
  }
  
  // Get all summaries
  public async getAllSummaries(): Promise<MedicalSummary[]> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(Array.from(this.storage.values()));
      }, 400);
    });
  }
  
  // Get summary by ID
  public async getSummaryById(id: string): Promise<MedicalSummary | null> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const summary = this.storage.get(id) || null;
        resolve(summary);
      }, 300);
    });
  }
  
  // Save summary to local history (committing it from pending to saved)
  public async saveSummaryToHistory(id: string): Promise<MedicalSummary> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const summary = this.storage.get(id);
        if (!summary) {
          reject(new Error('Summary not found'));
          return;
        }
        
        // Update the summary status to saved and add timestamp
        const updatedSummary: MedicalSummary = { 
          ...summary, 
          status: 'saved',
          savedAt: new Date().toISOString()
        };
        this.storage.set(id, updatedSummary);
        this.persistToLocalStorage();
        resolve(updatedSummary);
      }, 800); // Simulate transaction processing
    });
  }

  // Delete a single medical summary by ID
  public async deleteSummary(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.storage.delete(id);
        this.persistToLocalStorage();
        resolve();
      }, 300);
    });
  }

  // Clear all medical summaries
  public async clearAllSummaries(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.storage.clear();
        this.persistToLocalStorage();
        resolve();
      }, 500);
    });
  }
  
  // Persist to localStorage
  private persistToLocalStorage(): void {
    const data = Array.from(this.storage.values());
    localStorage.setItem('healthscribe_nfts', JSON.stringify(data));
  }
}

export default MockLocalServer.getInstance();
