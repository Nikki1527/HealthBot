import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Bell, Key, Lock, Save, Database, Trash2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mockServer from '@/services/mockServer';

const Profile = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [storageSize, setStorageSize] = useState(0);
  const [customApiKey, setCustomApiKey] = useState('');
  const { toast } = useToast();

  const calculateStats = async () => {
    const data = await mockServer.getAllSummaries();
    setTotalRecords(data.length);
    const jsonString = localStorage.getItem('healthscribe_nfts') || '';
    const bytes = new Blob([jsonString]).size;
    setStorageSize(parseFloat((bytes / 1024).toFixed(2)));
  };

  useEffect(() => {
    calculateStats();
    
    // Load custom API key on mount
    const savedKey = localStorage.getItem('groq_api_key') || '';
    setCustomApiKey(savedKey);
  }, []);

  const handleSaveApiKey = () => {
    if (!customApiKey.trim().startsWith('gsk_')) {
      toast({
        title: "Invalid Format",
        description: "Groq API keys should start with 'gsk_'. Please verify your key.",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem('groq_api_key', customApiKey.trim());
    toast({
      title: "API Key Saved",
      description: "Your custom Groq API Key has been saved successfully.",
    });
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setCustomApiKey('');
    toast({
      title: "API Key Cleared",
      description: "Custom API key removed. Reverted to default key and local smart fallback.",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleExportData = async () => {
    try {
      const data = await mockServer.getAllSummaries();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthscribe-records-backup.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Exported",
        description: "Your local health records backup has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export records backup.",
        variant: "destructive"
      });
    }
  };

  const handleClearHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently clear all health reports? This action is irreversible and will delete all records from this browser's local storage."
    );
    
    if (confirmed) {
      try {
        await mockServer.clearAllSummaries();
        toast({
          title: "History Cleared",
          description: "All medical records have been permanently deleted from this device.",
          variant: "destructive"
        });
        calculateStats();
      } catch (error) {
        toast({
          title: "Error Clearing History",
          description: "An error occurred while deleting your records.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRestoreSampleData = async () => {
    // Reset local storage to let constructor re-populate defaults
    localStorage.removeItem('healthscribe_nfts');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-dark dark:text-white mb-6">Account Settings</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="data" className="gap-2">
                <Database className="h-4 w-4" />
                Data Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select 
                      id="gender" 
                      className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary dark:text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={handleSaveProfile}
                    className="gap-2 bg-medical-primary hover:bg-medical-primary/90 text-white font-medium"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button className="gap-2 bg-medical-primary hover:bg-medical-primary/90 text-white font-medium">
                    <Key className="h-4 w-4" />
                    Update Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Receive updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Health Summaries</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Get notifications about new health summaries</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">AI Analysis Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Get alerts when high-severity symptoms are identified</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Receive marketing and product feature announcements</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button className="gap-2 bg-medical-primary hover:bg-medical-primary/90 text-white font-medium">
                    <Bell className="h-4 w-4" />
                    Update Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Local Storage & Database</CardTitle>
                  <CardDescription>
                    Manage the private electronic health records stored locally inside your browser sandboxed sandbox.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border dark:border-slate-800">
                    <div className="text-center p-2">
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase">Total Reports</p>
                      <p className="text-2xl font-bold text-medical-dark dark:text-white mt-1">{totalRecords}</p>
                    </div>
                    <div className="text-center p-2 border-t md:border-t-0 md:border-x dark:border-slate-800">
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase">Storage Used</p>
                      <p className="text-2xl font-bold text-medical-dark dark:text-white mt-1">{storageSize} KB</p>
                    </div>
                    <div className="text-center p-2 border-t md:border-t-0">
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase">Security Level</p>
                      <p className="text-sm font-semibold text-green-600 mt-2 flex items-center justify-center gap-1">
                        <Shield className="h-4 w-4" /> Sandboxed Local EHR
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3 border dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Backup Local Data</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Download all your medical reports as a combined clinical JSON document</p>
                      </div>
                      <Button 
                        onClick={handleExportData} 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5"
                      >
                        <Download className="h-4 w-4" /> Export Backup
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Reset & Restore Default Samples</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Restore the original mock medical cases to test dashboard functions</p>
                      </div>
                      <Button 
                        onClick={handleRestoreSampleData} 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5"
                      >
                        <RefreshCw className="h-4 w-4" /> Restore Samples
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2 p-3 border dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Groq API Key Configuration</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Provide your own Groq API Key (starts with gsk_) to enable direct Llama 3 analysis. If none is provided, the app will run in smart offline clinical fallback mode.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="password"
                          placeholder="Enter your Groq API key (gsk_...)"
                          value={customApiKey}
                          onChange={(e) => setCustomApiKey(e.target.value)}
                          className="font-mono text-xs flex-1 dark:bg-slate-900 dark:text-white dark:border-slate-800"
                        />
                        <Button 
                          onClick={handleSaveApiKey} 
                          size="sm" 
                          className="bg-medical-primary hover:bg-medical-primary/90 text-white font-medium"
                        >
                          Save Key
                        </Button>
                        {customApiKey && (
                          <Button 
                            onClick={handleRemoveApiKey} 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-red-100 dark:border-red-950/20 rounded-lg hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-red-600">Permanently Clear Records</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Erase all clinical summaries and diagnostics from this computer's browser storage</p>
                      </div>
                      <Button 
                        onClick={handleClearHistory} 
                        variant="destructive" 
                        size="sm" 
                        className="gap-1.5"
                      >
                        <Trash2 className="h-4 w-4" /> Clear All Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
