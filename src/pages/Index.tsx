import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Database, Check, ArrowRight, Activity, Sparkles, BrainCircuit } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <NavBar />
      
      <main className="flex-grow overflow-hidden relative">
        {/* Glow backgrounds */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-medical-primary/5 blur-[80px] -z-10 animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[100px] -z-10"></div>
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 rounded-full text-medical-primary font-medium text-xs tracking-wider uppercase animate-fade-in">
                  <Sparkles className="h-3.5 w-3.5 text-medical-primary fill-current" />
                  AI Clinical Assistant
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-medical-dark dark:text-white leading-tight tracking-tight">
                  Your Smart AI Scribe <br />
                  <span className="bg-gradient-to-r from-medical-primary to-emerald-400 bg-clip-text text-transparent">
                    Driven by Advanced LLMs
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  HealthScribe uses state-of-the-art artificial intelligence to securely check symptoms, generate structured clinical summaries, and record your private local history.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button asChild className="bg-gradient-to-r from-medical-primary to-sky-500 hover:from-medical-primary/90 hover:to-sky-500/90 text-white font-semibold shadow-md shadow-sky-500/20 px-6 h-12 rounded-xl transition-all duration-300">
                    <Link to="/chat">
                      <Heart className="h-4 w-4 mr-2 fill-current" />
                      Check Symptoms Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-6 rounded-xl text-slate-700 dark:text-slate-300">
                    <Link to="/dashboard">
                      <Database className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                      View Health Records
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative lg:pl-10">
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] -z-10 opacity-70"></div>
                
                <div className="relative z-10 glass-card rounded-2xl p-6 md:p-8 border border-white/60 dark:border-slate-800/80 shadow-xl">
                  <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-medical-primary to-emerald-400 text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-500/20">
                    <Activity className="h-3.5 w-3.5 animate-pulse" /> AI Diagnostic Report
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center text-medical-primary shadow-sm">
                        <BrainCircuit className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white tracking-tight">Clinical Summary</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">June 10, 2026</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Symptoms Checked:</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">Headache</span>
                          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">Fatigue</span>
                          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">Fever</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">AI Assessment:</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 border-l-2 border-medical-primary pl-3 py-1 bg-sky-50/30 dark:bg-sky-950/20 rounded-r-md leading-relaxed">
                          Symptoms indicate moderate infection. Rest, cooling hydration, and paracetamol recommended. Seek clinical assessment if fever lasts more than 3 days.
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <Check className="h-4 w-4 mr-1 text-emerald-500 font-bold" /> Sandboxed Local Save
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30 rounded-full">
                          Medium Severity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating graphic element behind card */}
                <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-gradient-to-tr from-sky-400/10 to-emerald-400/10 rounded-3xl -z-10 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/80 backdrop-blur-sm">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">
                Designed for Medical Integrity
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                HealthScribe combines instant natural language clinical scribe capabilities with sandboxed privacy systems.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
                <div className="h-12 w-12 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center mb-6 text-medical-primary shadow-sm">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-3">AI Symptom Analysis</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Engage in natural dialogues. The assistant extracts core clinical findings using advanced Llama 3 models via Groq API.
                </p>
                <Link to="/chat" className="text-medical-primary flex items-center text-sm font-semibold hover:gap-1.5 transition-all">
                  Check symptoms <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="glass-card p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center mb-6 text-emerald-500 shadow-sm">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-3">Structured Scribing</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Get formal clinical reports detailing extracted symptoms, suspected issues, severity scales, and home care recommendations.
                </p>
                <Link to="/dashboard" className="text-emerald-500 flex items-center text-sm font-semibold hover:gap-1.5 transition-all">
                  Browse history <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="glass-card p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
                <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center mb-6 text-rose-500 shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-3">Sandboxed Offline Privacy</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Your health reports are saved only on your local browser sandboxed storage. Backup, restore, or wipe data with total control.
                </p>
                <Link to="/profile" className="text-rose-500 flex items-center text-sm font-semibold hover:gap-1.5 transition-all">
                  Privacy Settings <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        

      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
