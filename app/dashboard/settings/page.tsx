"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Save, 
  Settings, 
  Bell, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Users,
  Calendar,
  CreditCard,
  FileText,
  Lock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Network,
  Clock,
  BellRing,
  Zap,
  Palette,
  Languages,
  Cloud,
  HardDrive,
  Cpu,
  Activity,
  Wifi,
  WifiOff,
  Upload,
  Download,
  Key,
  Users as UsersIcon,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  BadgeAlert
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface Settings {
  general: {
    appName: string;
    appEmail: string;
    appPhone: string;
    appUrl: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
  };
  registration: {
    maxCapacity: number;
    registrationOpen: boolean;
    earlyBirdDeadline: string;
    regularDeadline: string;
    requireApproval: boolean;
    allowGroupRegistration: boolean;
    minAge: number;
    maxAge: number;
    depositRequired: boolean;
    depositAmount: number;
  };
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromName: string;
    fromEmail: string;
    replyTo: string;
    sendWelcomeEmail: boolean;
    sendConfirmationEmail: boolean;
    sendReminderEmails: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    slackWebhook: string;
    discordWebhook: string;
    telegramBotToken: string;
    telegramChatId: string;
    pushNotifications: boolean;
    browserNotifications: boolean;
    notifyOnRegistration: boolean;
    notifyOnPayment: boolean;
    notifyOnCheckin: boolean;
  };
  security: {
    require2FA: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
    ipWhitelist: string[];
    apiRateLimit: number;
    enableAuditLog: boolean;
    encryptSensitiveData: boolean;
  };
  payment: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    bankTransferEnabled: boolean;
    bankDetails: string;
    currency: string;
    enablePartialPayments: boolean;
    partialPaymentPercentage: number;
    enableRefunds: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    enableAnimations: boolean;
    customCss: string;
    customJs: string;
    headerText: string;
    footerText: string;
  };
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
  activeUsers: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  realTimeConnections: number;
  lastBackup: string;
  databaseSize: number;
}

export default function AdvancedSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      appName: "Young Ministers Retreat",
      appEmail: "info@ymr.org",
      appPhone: "+234 123 456 7890",
      appUrl: "https://ymr.example.com",
      timezone: "Africa/Lagos",
      language: "en",
      currency: "NGN",
      dateFormat: "DD/MM/YYYY"
    },
    registration: {
      maxCapacity: 500,
      registrationOpen: true,
      earlyBirdDeadline: "2024-12-31",
      regularDeadline: "2025-02-28",
      requireApproval: false,
      allowGroupRegistration: true,
      minAge: 18,
      maxAge: 65,
      depositRequired: true,
      depositAmount: 5000
    },
    email: {
      enabled: true,
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "noreply@ymr.org",
      smtpPassword: "",
      smtpSecure: true,
      fromName: "YMR Team",
      fromEmail: "noreply@ymr.org",
      replyTo: "support@ymr.org",
      sendWelcomeEmail: true,
      sendConfirmationEmail: true,
      sendReminderEmails: true
    },
    notifications: {
      emailNotifications: true,
      slackWebhook: "",
      discordWebhook: "",
      telegramBotToken: "",
      telegramChatId: "",
      pushNotifications: false,
      browserNotifications: true,
      notifyOnRegistration: true,
      notifyOnPayment: true,
      notifyOnCheckin: true
    },
    security: {
      require2FA: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPassword: true,
      ipWhitelist: [],
      apiRateLimit: 100,
      enableAuditLog: true,
      encryptSensitiveData: true
    },
    payment: {
      stripeEnabled: false,
      stripePublicKey: "",
      stripeSecretKey: "",
      stripeWebhookSecret: "",
      paypalEnabled: false,
      paypalClientId: "",
      paypalSecret: "",
      bankTransferEnabled: true,
      bankDetails: "Account: 1234567890\nBank: Zenith Bank\nName: YMR Ministry",
      currency: "NGN",
      enablePartialPayments: true,
      partialPaymentPercentage: 50,
      enableRefunds: true
    },
    appearance: {
      theme: "system",
      primaryColor: "#10b981",
      secondaryColor: "#3b82f6",
      logoUrl: "/logo.png",
      faviconUrl: "/favicon.ico",
      enableAnimations: true,
      customCss: "",
      customJs: "",
      headerText: "Young Ministers Retreat 2025",
      footerText: "© 2025 YMR Ministry. All rights reserved."
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [realTimeConnected, setRealTimeConnected] = useState(false);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const originalSettingsRef = useRef<Settings | null>(null);

  // Initialize WebSocket connection for real-time settings sync
  const initWebSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws/settings`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected for settings sync');
        setRealTimeConnected(true);
        toast.success("Real-time sync enabled", {
          description: "Settings will sync across all admin sessions"
        });
        
        // Request current settings
        ws.send(JSON.stringify({
          type: 'get_settings',
          userId: 'admin' // In real app, use actual user ID
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'settings_update':
              const updatedSettings = data.data;
              setSettings(updatedSettings);
              originalSettingsRef.current = JSON.parse(JSON.stringify(updatedSettings));
              setHasChanges(false);
              toast.info("Settings updated", {
                description: "Settings were updated by another admin"
              });
              break;
              
            case 'metrics_update':
              setSystemMetrics(data.data);
              break;
              
            case 'save_confirmation':
              setLastSaved(new Date().toLocaleTimeString());
              setIsSaving(false);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setRealTimeConnected(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setRealTimeConnected(false);
        // Attempt reconnect after 5 seconds
        setTimeout(() => initWebSocket(), 5000);
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket setup failed:', error);
    }
  }, []);

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/settings');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSettings(data.data);
            originalSettingsRef.current = JSON.parse(JSON.stringify(data.data));
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
    initWebSocket();

    // Load system metrics periodically
    const loadMetrics = () => {
      fetch('/api/admin/metrics')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSystemMetrics(data.data);
          }
        })
        .catch(console.error);
    };

    loadMetrics();
    const metricsInterval = setInterval(loadMetrics, 30000); // Update every 30 seconds

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [initWebSocket]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasChanges) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSave, hasChanges, settings]);

  // Detect changes
  useEffect(() => {
    if (originalSettingsRef.current) {
      const hasDiff = JSON.stringify(settings) !== JSON.stringify(originalSettingsRef.current);
      setHasChanges(hasDiff);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          originalSettingsRef.current = JSON.parse(JSON.stringify(settings));
          setHasChanges(false);
          setLastSaved(new Date().toLocaleTimeString());
          
          // Broadcast update to other admins via WebSocket
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'settings_update',
              data: settings,
              timestamp: Date.now()
            }));
          }
          
          toast.success("Settings saved successfully", {
            description: "Changes have been applied and synced across all sessions"
          });
        } else {
          throw new Error(data.error || 'Failed to save settings');
        }
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save settings", {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSensitive = (key: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testEmailSettings = async () => {
    try {
      toast.info("Testing email configuration...");
      
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: settings.general.appEmail,
          subject: 'Test Email from YMR Settings',
          message: 'This is a test email to verify your email configuration.'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Email test sent successfully", {
          description: "Check your inbox for the test email"
        });
      } else {
        throw new Error(data.error || 'Email test failed');
      }
    } catch (error) {
      toast.error("Email test failed", {
        description: error instanceof Error ? error.message : 'Please check your SMTP settings'
      });
    }
  };

  const testDatabaseConnection = async () => {
    try {
      toast.info("Testing database connection...");
      
      const response = await fetch('/api/admin/settings/test-db');
      const data = await response.json();
      
      if (data.success) {
        toast.success("Database connection successful", {
          description: `Connected to ${data.data.type} database`
        });
      } else {
        throw new Error(data.error || 'Database connection failed');
      }
    } catch (error) {
      toast.error("Database connection failed", {
        description: error instanceof Error ? error.message : 'Please check your connection'
      });
    }
  };

  const backupDatabase = async () => {
    try {
      toast.info("Creating database backup...");
      
      const response = await fetch('/api/admin/settings/backup', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Backup created successfully", {
          description: `Backup saved as ${data.data.filename}`
        });
      } else {
        throw new Error(data.error || 'Backup failed');
      }
    } catch (error) {
      toast.error("Backup failed", {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  };

  const resetToDefaults = (section: keyof Settings) => {
    const defaults: Settings = {
      general: {
        appName: "Young Ministers Retreat",
        appEmail: "info@ymr.org",
        appPhone: "+234 123 456 7890",
        appUrl: "https://ymr.example.com",
        timezone: "Africa/Lagos",
        language: "en",
        currency: "NGN",
        dateFormat: "DD/MM/YYYY"
      },
      registration: {
        maxCapacity: 500,
        registrationOpen: true,
        earlyBirdDeadline: "2024-12-31",
        regularDeadline: "2025-02-28",
        requireApproval: false,
        allowGroupRegistration: true,
        minAge: 18,
        maxAge: 65,
        depositRequired: true,
        depositAmount: 5000
      },
      email: {
        enabled: true,
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        smtpSecure: true,
        fromName: "YMR Team",
        fromEmail: "noreply@ymr.org",
        replyTo: "support@ymr.org",
        sendWelcomeEmail: true,
        sendConfirmationEmail: true,
        sendReminderEmails: true
      },
      notifications: {
        emailNotifications: true,
        slackWebhook: "",
        discordWebhook: "",
        telegramBotToken: "",
        telegramChatId: "",
        pushNotifications: false,
        browserNotifications: true,
        notifyOnRegistration: true,
        notifyOnPayment: true,
        notifyOnCheckin: true
      },
      security: {
        require2FA: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireStrongPassword: true,
        ipWhitelist: [],
        apiRateLimit: 100,
        enableAuditLog: true,
        encryptSensitiveData: true
      },
      payment: {
        stripeEnabled: false,
        stripePublicKey: "",
        stripeSecretKey: "",
        stripeWebhookSecret: "",
        paypalEnabled: false,
        paypalClientId: "",
        paypalSecret: "",
        bankTransferEnabled: true,
        bankDetails: "Account: 1234567890\nBank: Zenith Bank\nName: YMR Ministry",
        currency: "NGN",
        enablePartialPayments: true,
        partialPaymentPercentage: 50,
        enableRefunds: true
      },
      appearance: {
        theme: "system",
        primaryColor: "#10b981",
        secondaryColor: "#3b82f6",
        logoUrl: "/logo.png",
        faviconUrl: "/favicon.ico",
        enableAnimations: true,
        customCss: "",
        customJs: "",
        headerText: "Young Ministers Retreat 2025",
        footerText: "© 2025 YMR Ministry. All rights reserved."
      }
    };

    setSettings(prev => ({
      ...prev,
      [section]: defaults[section]
    }));
    
    toast.info(`Reset ${section} to defaults`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <Badge variant={realTimeConnected ? "default" : "secondary"} className="ml-2">
              {realTimeConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Real-time Sync
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Configure application settings and system preferences
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
              id="auto-save"
            />
            <Label htmlFor="auto-save" className="text-sm cursor-pointer">
              Auto-save
            </Label>
          </div>
          
          {hasChanges && (
            <Badge variant="outline" className="animate-pulse text-yellow-600 border-yellow-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !hasChanges}
            className={cn(
              "transition-all duration-200",
              hasChanges && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status Bar */}
      {systemMetrics && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Cpu className="w-6 h-6 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{systemMetrics.cpu}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{systemMetrics.memory}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disk</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{systemMetrics.disk}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <UsersIcon className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{systemMetrics.activeUsers}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {Math.floor(systemMetrics.uptime / 3600)}h
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:grid-cols-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Registration</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="w-4 h-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span className="hidden md:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic application configuration and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName">Application Name</Label>
                    <Input
                      id="appName"
                      value={settings.general.appName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, appName: e.target.value }
                      }))}
                      placeholder="Young Ministers Retreat"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="appUrl">Application URL</Label>
                    <Input
                      id="appUrl"
                      value={settings.general.appUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, appUrl: e.target.value }
                      }))}
                      placeholder="https://ymr.example.com"
                      type="url"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, timezone: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">Africa/Lagos (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">America/New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appEmail">Contact Email</Label>
                    <Input
                      id="appEmail"
                      value={settings.general.appEmail}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, appEmail: e.target.value }
                      }))}
                      placeholder="info@ymr.org"
                      type="email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="appPhone">Contact Phone</Label>
                    <Input
                      id="appPhone"
                      value={settings.general.appPhone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, appPhone: e.target.value }
                      }))}
                      placeholder="+234 123 456 7890"
                      type="tel"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, language: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => resetToDefaults('general')}>
                Reset to Defaults
              </Button>
              <div className="text-sm text-gray-500">
                Last saved: {lastSaved || 'Never'}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Registration Settings */}
        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registration Settings
              </CardTitle>
              <CardDescription>
                Configure registration rules and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={settings.registration.maxCapacity}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, maxCapacity: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minAge">Minimum Age</Label>
                    <Input
                      id="minAge"
                      type="number"
                      value={settings.registration.minAge}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, minAge: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="earlyBirdDeadline">Early Bird Deadline</Label>
                    <Input
                      id="earlyBirdDeadline"
                      type="date"
                      value={settings.registration.earlyBirdDeadline}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, earlyBirdDeadline: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxAge">Maximum Age</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={settings.registration.maxAge}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, maxAge: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="depositAmount">Deposit Amount</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={settings.registration.depositAmount}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, depositAmount: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="regularDeadline">Regular Deadline</Label>
                    <Input
                      id="regularDeadline"
                      type="date"
                      value={settings.registration.regularDeadline}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        registration: { ...prev.registration, regularDeadline: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationOpen">Registration Open</Label>
                    <p className="text-sm text-gray-500">Allow new registrations</p>
                  </div>
                  <Switch
                    id="registrationOpen"
                    checked={settings.registration.registrationOpen}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      registration: { ...prev.registration, registrationOpen: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireApproval">Require Approval</Label>
                    <p className="text-sm text-gray-500">Manually approve each registration</p>
                  </div>
                  <Switch
                    id="requireApproval"
                    checked={settings.registration.requireApproval}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      registration: { ...prev.registration, requireApproval: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowGroupRegistration">Allow Group Registration</Label>
                    <p className="text-sm text-gray-500">Enable registration for multiple people</p>
                  </div>
                  <Switch
                    id="allowGroupRegistration"
                    checked={settings.registration.allowGroupRegistration}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      registration: { ...prev.registration, allowGroupRegistration: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="depositRequired">Deposit Required</Label>
                    <p className="text-sm text-gray-500">Require deposit for registration</p>
                  </div>
                  <Switch
                    id="depositRequired"
                    checked={settings.registration.depositRequired}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      registration: { ...prev.registration, depositRequired: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="emailEnabled">Email Service</Label>
                  <p className="text-sm text-gray-500">Enable or disable email functionality</p>
                </div>
                <Switch
                  id="emailEnabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    email: { ...prev.email, enabled: checked }
                  }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpHost: e.target.value }
                      }))}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                      }))}
                      placeholder="587"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.email.smtpUser}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpUser: e.target.value }
                      }))}
                      placeholder="noreply@ymr.org"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <div className="relative">
                      <Input
                        id="smtpPassword"
                        type={showSensitive.smtpPassword ? "text" : "password"}
                        value={settings.email.smtpPassword}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, smtpPassword: e.target.value }
                        }))}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => toggleSensitive('smtpPassword')}
                      >
                        {showSensitive.smtpPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, fromEmail: e.target.value }
                      }))}
                      placeholder="noreply@ymr.org"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, fromName: e.target.value }
                      }))}
                      placeholder="YMR Team"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="replyTo">Reply To</Label>
                    <Input
                      id="replyTo"
                      value={settings.email.replyTo}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, replyTo: e.target.value }
                      }))}
                      placeholder="support@ymr.org"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                    <p className="text-sm text-gray-500">Enable secure connection</p>
                  </div>
                  <Switch
                    id="smtpSecure"
                    checked={settings.email.smtpSecure}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpSecure: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendWelcomeEmail">Send Welcome Email</Label>
                    <p className="text-sm text-gray-500">Send email after registration</p>
                  </div>
                  <Switch
                    id="sendWelcomeEmail"
                    checked={settings.email.sendWelcomeEmail}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, sendWelcomeEmail: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendConfirmationEmail">Send Confirmation Email</Label>
                    <p className="text-sm text-gray-500">Send confirmation after approval</p>
                  </div>
                  <Switch
                    id="sendConfirmationEmail"
                    checked={settings.email.sendConfirmationEmail}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, sendConfirmationEmail: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={testEmailSettings}>
                Test Email Connection
              </Button>
              <Button variant="outline" onClick={() => resetToDefaults('email')}>
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification channels and triggers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailNotifications: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Enable browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, pushNotifications: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browserNotifications">Browser Notifications</Label>
                    <p className="text-sm text-gray-500">Show desktop notifications</p>
                  </div>
                  <Switch
                    id="browserNotifications"
                    checked={settings.notifications.browserNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, browserNotifications: checked }
                    }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyOnRegistration">Notify on Registration</Label>
                    <p className="text-sm text-gray-500">Send notification for new registrations</p>
                  </div>
                  <Switch
                    id="notifyOnRegistration"
                    checked={settings.notifications.notifyOnRegistration}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, notifyOnRegistration: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyOnPayment">Notify on Payment</Label>
                    <p className="text-sm text-gray-500">Send notification for payments</p>
                  </div>
                  <Switch
                    id="notifyOnPayment"
                    checked={settings.notifications.notifyOnPayment}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, notifyOnPayment: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyOnCheckin">Notify on Check-in</Label>
                    <p className="text-sm text-gray-500">Send notification for check-ins</p>
                  </div>
                  <Switch
                    id="notifyOnCheckin"
                    checked={settings.notifications.notifyOnCheckin}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, notifyOnCheckin: checked }
                    }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhook"
                    value={settings.notifications.slackWebhook}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, slackWebhook: e.target.value }
                    }))}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                  <Input
                    id="discordWebhook"
                    value={settings.notifications.discordWebhook}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, discordWebhook: e.target.value }
                    }))}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require2FA">Require 2FA</Label>
                    <p className="text-sm text-gray-500">Enable two-factor authentication for admins</p>
                  </div>
                  <Switch
                    id="require2FA"
                    checked={settings.security.require2FA}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, require2FA: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAuditLog">Enable Audit Log</Label>
                    <p className="text-sm text-gray-500">Log all admin activities</p>
                  </div>
                  <Switch
                    id="enableAuditLog"
                    checked={settings.security.enableAuditLog}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, enableAuditLog: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="encryptSensitiveData">Encrypt Sensitive Data</Label>
                    <p className="text-sm text-gray-500">Encrypt sensitive information in database</p>
                  </div>
                  <Switch
                    id="encryptSensitiveData"
                    checked={settings.security.encryptSensitiveData}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, encryptSensitiveData: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireStrongPassword">Require Strong Password</Label>
                    <p className="text-sm text-gray-500">Enforce strong password policy</p>
                  </div>
                  <Switch
                    id="requireStrongPassword"
                    checked={settings.security.requireStrongPassword}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, requireStrongPassword: checked }
                    }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="apiRateLimit">API Rate Limit (per minute)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={settings.security.apiRateLimit}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, apiRateLimit: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => resetToDefaults('security')}>
                Reset Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment gateways and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stripeEnabled">Stripe Payment</Label>
                    <p className="text-sm text-gray-500">Enable Stripe payment gateway</p>
                  </div>
                  <Switch
                    id="stripeEnabled"
                    checked={settings.payment.stripeEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, stripeEnabled: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paypalEnabled">PayPal Payment</Label>
                    <p className="text-sm text-gray-500">Enable PayPal payment gateway</p>
                  </div>
                  <Switch
                    id="paypalEnabled"
                    checked={settings.payment.paypalEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, paypalEnabled: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bankTransferEnabled">Bank Transfer</Label>
                    <p className="text-sm text-gray-500">Enable bank transfer payments</p>
                  </div>
                  <Switch
                    id="bankTransferEnabled"
                    checked={settings.payment.bankTransferEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, bankTransferEnabled: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePartialPayments">Partial Payments</Label>
                    <p className="text-sm text-gray-500">Allow partial payments/deposits</p>
                  </div>
                  <Switch
                    id="enablePartialPayments"
                    checked={settings.payment.enablePartialPayments}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, enablePartialPayments: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRefunds">Enable Refunds</Label>
                    <p className="text-sm text-gray-500">Allow refund processing</p>
                  </div>
                  <Switch
                    id="enableRefunds"
                    checked={settings.payment.enableRefunds}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, enableRefunds: checked }
                    }))}
                  />
                </div>
              </div>
              
              {settings.payment.stripeEnabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Stripe Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                        <Input
                          id="stripePublicKey"
                          value={settings.payment.stripePublicKey}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            payment: { ...prev.payment, stripePublicKey: e.target.value }
                          }))}
                          placeholder="pk_live_..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                        <div className="relative">
                          <Input
                            id="stripeSecretKey"
                            type={showSensitive.stripeSecretKey ? "text" : "password"}
                            value={settings.payment.stripeSecretKey}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, stripeSecretKey: e.target.value }
                            }))}
                            placeholder="sk_live_..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => toggleSensitive('stripeSecretKey')}
                          >
                            {showSensitive.stripeSecretKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {settings.payment.bankTransferEnabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Bank Transfer Details</h4>
                    <div>
                      <Label htmlFor="bankDetails">Bank Account Information</Label>
                      <Textarea
                        id="bankDetails"
                        value={settings.payment.bankDetails}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          payment: { ...prev.payment, bankDetails: e.target.value }
                        }))}
                        rows={4}
                        placeholder="Account Number: 1234567890&#10;Bank Name: Zenith Bank&#10;Account Name: YMR Ministry"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: value as "light" | "dark" | "system" }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primaryColor"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, primaryColor: e.target.value }
                        }))}
                        placeholder="#10b981"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: settings.appearance.primaryColor }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, logoUrl: e.target.value }
                      }))}
                      placeholder="/logo.png"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondaryColor"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, secondaryColor: e.target.value }
                        }))}
                        placeholder="#3b82f6"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: settings.appearance.secondaryColor }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={settings.appearance.faviconUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, faviconUrl: e.target.value }
                      }))}
                      placeholder="/favicon.ico"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAnimations">Enable Animations</Label>
                      <p className="text-sm text-gray-500">Enable UI animations and transitions</p>
                    </div>
                    <Switch
                      id="enableAnimations"
                      checked={settings.appearance.enableAnimations}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, enableAnimations: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headerText">Header Text</Label>
                  <Input
                    id="headerText"
                    value={settings.appearance.headerText}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, headerText: e.target.value }
                    }))}
                    placeholder="Young Ministers Retreat 2025"
                  />
                </div>
                
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={settings.appearance.footerText}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, footerText: e.target.value }
                    }))}
                    placeholder="© 2025 YMR Ministry. All rights reserved."
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea
                    id="customCss"
                    value={settings.appearance.customCss}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, customCss: e.target.value }
                    }))}
                    rows={4}
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customJs">Custom JavaScript</Label>
                  <Textarea
                    id="customJs"
                    value={settings.appearance.customJs}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, customJs: e.target.value }
                    }))}
                    rows={4}
                    placeholder="// Add your custom JavaScript here"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  System metrics and monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                {systemMetrics ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                          <span className="font-medium">{systemMetrics.cpu}%</span>
                        </div>
                        <Progress value={systemMetrics.cpu} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                          <span className="font-medium">{systemMetrics.memory}%</span>
                        </div>
                        <Progress value={systemMetrics.memory} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Disk Usage</span>
                          <span className="font-medium">{systemMetrics.disk}%</span>
                        </div>
                        <Progress value={systemMetrics.disk} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Database Size</span>
                          <span className="font-medium">
                            {(systemMetrics.databaseSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <Progress 
                          value={(systemMetrics.databaseSize / (50 * 1024 * 1024)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {systemMetrics.totalRegistrations}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {systemMetrics.pendingRegistrations}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {systemMetrics.activeUsers}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {systemMetrics.realTimeConnections}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Live Connections</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">System Uptime</span>
                        <span className="font-medium">
                          {Math.floor(systemMetrics.uptime / 3600)}h {Math.floor((systemMetrics.uptime % 3600) / 60)}m
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                        <span className="font-medium">{systemMetrics.lastBackup || 'Never'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Real-time Status</span>
                        <Badge variant={realTimeConnected ? "default" : "secondary"}>
                          {realTimeConnected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" onClick={testDatabaseConnection}>
                  <Database className="w-4 h-4 mr-2" />
                  Test Database
                </Button>
                <Button variant="outline" onClick={backupDatabase}>
                  <Download className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>System management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  fetch('/api/admin/system/clear-cache', { method: 'POST' })
                    .then(() => toast.success('Cache cleared successfully'))
                    .catch(() => toast.error('Failed to clear cache'));
                }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  fetch('/api/admin/system/restart', { method: 'POST' })
                    .then(() => toast.success('System restart initiated'))
                    .catch(() => toast.error('Failed to restart system'));
                }}>
                  <Activity className="w-4 h-4 mr-2" />
                  Restart System
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  fetch('/api/admin/system/logs', { method: 'GET' })
                    .then(res => res.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'system-logs.json';
                      a.click();
                    })
                    .catch(() => toast.error('Failed to download logs'));
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download Logs
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  fetch('/api/admin/system/health', { method: 'GET' })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast.success('System health check passed', {
                          description: 'All systems are operational'
                        });
                      } else {
                        toast.error('System health check failed');
                      }
                    })
                    .catch(() => toast.error('Health check failed'));
                }}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Health Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Status Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96"
          >
            <Card className="border-green-500/20 bg-green-50 dark:bg-green-900/10 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Unsaved Changes
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You have unsaved changes in settings
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (originalSettingsRef.current) {
                          setSettings(originalSettingsRef.current);
                        }
                      }}
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? 'Saving...' : 'Save Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}