
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-medical-primary" />
            <span className="text-lg font-semibold text-medical-dark dark:text-white">HealthScribe</span>
          </div>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>AI-powered symptom checker and medical scribe.</p>
            <p>© {new Date().getFullYear()} HealthScribe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
