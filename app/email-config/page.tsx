"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailConfiguration } from "@/lib/types";
import { Settings, Mail, Plus, X, CheckCircle } from "lucide-react";

export default function EmailConfig() {
  const [config, setConfig] = useState<EmailConfiguration>({
    emails: [],
    frequency: 'daily',
    sources: ['meritmind', 'poolia', 'arbetsformedlingen'],
  });
  const [newEmail, setNewEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const addEmail = () => {
    if (newEmail && !config.emails.includes(newEmail)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(newEmail)) {
        setConfig(prev => ({
          ...prev,
          emails: [...prev.emails, newEmail]
        }));
        setNewEmail("");
      }
    }
  };

  const removeEmail = (email: string) => {
    setConfig(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email)
    }));
  };

  const toggleSource = (source: string) => {
    setConfig(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const saveConfiguration = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('email-config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sourceLabels = {
    meritmind: "Meritmind",
    poolia: "Poolia",
    arbetsformedlingen: "Arbetsförmedlingen",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 dark:from-background dark:via-purple-950/10 dark:to-pink-950/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3 justify-center">
                <Settings className="h-10 w-10 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Email Configuration
                </span>
              </h1>
              <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-muted-foreground mt-4 text-lg">
              Configure email notifications for job listings
            </p>
          </div>

          <Tabs defaultValue="emails" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger 
                value="emails"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Email Addresses
              </TabsTrigger>
              <TabsTrigger 
                value="preferences"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="emails" className="mt-8">
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-card dark:to-purple-950/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    <Mail className="h-5 w-5 text-purple-600" />
                    Email Addresses
                  </CardTitle>
                  <CardDescription>
                    Manage the email addresses that will receive job notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add new email */}
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                      className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button 
                      onClick={addEmail} 
                      disabled={!newEmail}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Email list */}
                  <div className="space-y-2">
                    <Label className="text-purple-700 dark:text-purple-300 font-semibold">
                      Configured Email Addresses ({config.emails.length})
                    </Label>
                    {config.emails.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                        <Mail className="h-12 w-12 mx-auto mb-2 text-purple-400" />
                        <p>No email addresses configured</p>
                        <p className="text-sm">Add an email address above to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {config.emails.map((email) => (
                          <div
                            key={email}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
                          >
                            <span className="font-medium">{email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmail(email)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Frequency */}
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-card dark:to-purple-950/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Notification Frequency
                    </CardTitle>
                    <CardDescription>
                      How often should we send job notifications?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                        <input
                          type="radio"
                          name="frequency"
                          value="daily"
                          checked={config.frequency === 'daily'}
                          onChange={(e) => setConfig(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' }))}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium">Daily</span>
                      </label>
                      <p className="text-sm text-muted-foreground ml-9">
                        Receive notifications every day with new job listings
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                        <input
                          type="radio"
                          name="frequency"
                          value="weekly"
                          checked={config.frequency === 'weekly'}
                          onChange={(e) => setConfig(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' }))}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium">Weekly</span>
                      </label>
                      <p className="text-sm text-muted-foreground ml-9">
                        Receive a weekly summary of all new job listings
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sources */}
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-card dark:to-purple-950/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Job Sources
                    </CardTitle>
                    <CardDescription>
                      Select which job sources to include in notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(sourceLabels).map(([key, label]) => (
                        <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.sources.includes(key)}
                            onChange={() => toggleSource(key)}
                            className="text-purple-600 focus:ring-purple-500 rounded"
                          />
                          <span className="font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {config.sources.length === 0 && (
                      <p className="text-red-500 text-sm mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                        Please select at least one source
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save button */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={saveConfiguration}
              disabled={config.emails.length === 0 || config.sources.length === 0}
              className="min-w-[160px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {saved ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Configuration Saved!
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>

          {/* Configuration Summary */}
          <Card className="mt-8 border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-card dark:to-purple-950/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Email Addresses</Label>
                  <p className="font-bold text-2xl text-purple-600">{config.emails.length}</p>
                  <p className="text-sm text-muted-foreground">configured</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Frequency</Label>
                  <p className="font-bold text-2xl text-purple-600 capitalize">{config.frequency}</p>
                  <p className="text-sm text-muted-foreground">notifications</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Sources</Label>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {config.sources.map(source => (
                      <Badge key={source} variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300">
                        {sourceLabels[source as keyof typeof sourceLabels]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 