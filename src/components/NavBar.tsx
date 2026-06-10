
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Database, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

const NavBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 py-3 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-medical-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-medical-primary/25">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-medical-dark dark:text-white tracking-tight">HealthScribe</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" asChild className="dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300">
            <Link to="/dashboard">
              <Database className="h-4 w-4 mr-2" />
              My Records
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild className="dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300">
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl h-9 w-9 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
