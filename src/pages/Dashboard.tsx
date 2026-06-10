import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SummaryCard, { MedicalSummary } from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { FilterX, Search, CheckCircle, Database, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import mockServer from '@/services/mockServer';

const Dashboard = () => {
  const [summaries, setSummaries] = useState<MedicalSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const data = await mockServer.getAllSummaries();
      setSummaries(data);
    } catch (error) {
      console.error("Error fetching medical summaries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const handleSaveSummary = async (summaryId: string) => {
    try {
      await mockServer.saveSummaryToHistory(summaryId);
      toast({
        title: "Report Saved",
        description: "Your medical summary has been securely saved to your local history.",
      });
      fetchSummaries(); // Refresh list
    } catch (error) {
      toast({
        title: "Saving Failed",
        description: "Could not save the medical report to history.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSummary = async (summaryId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this report from your history?")) {
      try {
        await mockServer.deleteSummary(summaryId);
        toast({
          title: "Report Deleted",
          description: "The medical summary has been removed from this device.",
        });
        fetchSummaries(); // Refresh list
      } catch (error) {
        toast({
          title: "Error Deleting",
          description: "Could not remove the report from history.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    summary.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-transparent">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-dark dark:text-white mb-2">Your Health Records</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage and view your private AI-generated clinical summaries saved locally on your device.
            </p>
          </div>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <Input
              placeholder="Search by title or symptom..."
              className="pl-10 dark:bg-slate-900 dark:text-white dark:border-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')} className="gap-2">
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 border-4 border-medical-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading medical records...</p>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No medical records found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {searchQuery ? 'Try a different search term or clear filters' : 'You have no medical summaries yet'}
            </p>
            {!searchQuery && (
              <Button asChild className="bg-medical-primary hover:bg-medical-primary/90 text-white font-medium">
                <Link to="/chat">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Start Symptom Check
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSummaries.map((summary) => (
              <SummaryCard 
                key={summary.id} 
                summary={summary} 
                onSaveSummary={handleSaveSummary}
                onDeleteSummary={handleDeleteSummary}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
