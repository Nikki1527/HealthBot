import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, FileText, Activity, Trash2, Heart, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export type MedicalSummary = {
  id: string;
  date: string;
  title: string;
  description: string;
  symptoms: string[];
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  status: 'saved' | 'pending';
  savedAt?: string;
};

type SummaryCardProps = {
  summary: MedicalSummary;
  onSaveSummary: (summaryId: string) => void;
  onDeleteSummary?: (summaryId: string) => void;
};

const SummaryCard = ({ summary, onSaveSummary, onDeleteSummary }: SummaryCardProps) => {
  const [showReportData, setShowReportData] = useState(false);
  const { toast } = useToast();
  
  const severityColor = {
    low: 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900/30',
    medium: 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/30',
    high: 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30',
  };



  const handleViewReport = () => {
    setShowReportData(true);
  };

  return (
    <>
      <Card className="shadow-md border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{summary.title}</CardTitle>
              <CardDescription>{summary.date}</CardDescription>
            </div>
            <Badge className={severityColor[summary.severity]}>
              {summary.severity.charAt(0).toUpperCase() + summary.severity.slice(1)} Severity
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{summary.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Reported Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {summary.symptoms.map((symptom, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-slate-800 text-slate-850 dark:text-slate-200 border-slate-200 dark:border-slate-700">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Recommendation:</h4>
            <p className="text-sm border-l-2 border-medical-primary pl-3 py-1 text-slate-700 dark:text-slate-300">{summary.recommendation}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t dark:border-slate-800/80 pt-4">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-medical-primary mr-1 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified AI Report</span>
          </div>
          
          <div className="flex items-center gap-2">
            {summary.status === 'saved' ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white dark:border-slate-800 dark:hover:bg-slate-900"
                onClick={handleViewReport}
              >
                <FileText className="h-4 w-4" />
                View Details
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="bg-medical-accent hover:bg-medical-accent/90 gap-1 text-white"
                onClick={() => onSaveSummary(summary.id)}
              >
                <CheckCircle className="h-4 w-4" />
                Save Report
              </Button>
            )}

            {onDeleteSummary && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 dark:border-slate-800 p-2"
                onClick={() => onDeleteSummary(summary.id)}
                title="Delete Report"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showReportData} onOpenChange={setShowReportData}>
        <DialogContent className="max-w-xl dark:bg-slate-950 dark:border-slate-800">
          <DialogHeader className="border-b dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-medical-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-medical-primary/25">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Electronic Health Record (EHR)
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  HealthScribe Secured Local Clinical Chart
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-5 pt-3">
            {/* Clinical Metadata */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-200/50 dark:border-slate-850 pb-1.5">
                <span className="text-slate-400 font-semibold uppercase">EHR Document Reference</span>
                <span className="text-slate-500 dark:text-slate-400 font-bold">MED-REP-{summary.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Date Generated:</span>
                <span>{summary.date}</span>
                <span className="text-slate-400">Scribe Engine:</span>
                <span>Groq Llama-3.1 Clinical Agent</span>
                <span className="text-slate-400">Data Integrity:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Sandboxed Local Storage
                </span>
                {summary.savedAt && (
                  <>
                    <span className="text-slate-400">Saved At:</span>
                    <span>{new Date(summary.savedAt).toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Case Severity Alert Banner */}
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              summary.severity === 'high' 
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300'
                : summary.severity === 'medium'
                ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold">
                Clinical Priority Level: {summary.severity.toUpperCase()} SEVERITY CASE
              </span>
            </div>

            {/* Clinical Contents */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-medical-primary" />
                  I. History of Present Illness (Chief Complaint)
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 pl-5 bg-slate-50/50 dark:bg-slate-900/10 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900">
                  {summary.description}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  II. Extracted Symptoms & Review of Systems
                </h4>
                <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                  {summary.symptoms.map((symptom, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-sky-50/50 dark:bg-sky-950/20 text-medical-primary border-sky-100 dark:border-sky-900/30 font-medium rounded-md text-xs px-2 py-0.5"
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  III. Clinical Guidance & Home Care Plan
                </h4>
                <div className="pl-5 border-l-2 border-medical-primary py-1 bg-sky-50/30 dark:bg-sky-950/10 rounded-r-lg p-3">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {summary.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* EHR footer validation stamp */}
            <div className="flex items-center justify-between border-t dark:border-slate-800 pt-4 mt-2">
              <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-wider gap-1 font-mono">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                Validated Local Chart
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SummaryCard;
