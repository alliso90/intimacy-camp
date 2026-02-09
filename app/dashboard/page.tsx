"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  LogOut,
  Upload,
  Video,
  Music,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Eye,
  Download,
  PlayCircle,
  FileText,
  Activity,
  Filter,
  Search,
  MoreVertical,
  Edit,
  ExternalLink
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/lib/constants";

// Recharts imports
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Interfaces
interface DashboardStats {
  participants: {
    total: number;
    newToday: number;
    growth: {
      daily: number;
      weekly: number;
    };
  };
  volunteers: {
    total: number;
    active: number;
    growth: {
      daily: number;
      weekly: number;
    };
  };
  sermons: {
    total: number;
    totalViews: number;
    recent: number;
  };
  media: {
    total: number;
    videos: number;
    images: number;
    totalViews: number;
  };
  audio: {
    total: number;
    totalPlays: number;
  };
  testimonies: {
    total: number;
    pending: number;
    approved: number;
  };
  overview: {
    totalPeople: number;
    totalContent: number;
    totalEngagement: number;
  };
}

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  departments: string[];
  role?: string;
  status: 'active' | 'inactive';
  skills?: string[]; // Changed from skills: string[] to skills?: string[]
  createdAt: string;
}

interface Sermon {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  views: number;
  downloads: number;
  createdAt: string;
}

interface MediaClip {
  _id: string;
  title: string;
  type: 'video' | 'image' | 'short';
  category: string;
  views: number;
  createdAt: string;
}

interface AudioMessage {
  _id: string;
  title: string;
  speaker: string;
  duration: number;
  plays: number;
  createdAt: string;
}

interface Testimony {
  _id: string;
  title: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AnalyticsData {
  registrationTrends: { _id: string; count: number }[];
  topSermons: Sermon[];
  testimonyStats: { _id: string; count: number; pending: number; approved: number }[];
  mediaByCategory: { _id: string; count: number; totalViews: number }[];
  audioByCategory: { _id: string; count: number; totalPlays: number }[];
}

interface RecentActivity {
  _id: string;
  type: string;
  action: string;
  title: string;
  timestamp: string;
  user?: string;
}

type TabType = "overview" | "participants" | "volunteers" | "sermons" | "media" | "audio" | "testimonies" | "analytics";

// Color constants for charts
const CHART_COLORS = {
  blue: '#0088FE',
  green: '#00C49F',
  orange: '#FFBB28',
  red: '#FF8042',
  purple: '#8884D8',
  teal: '#82CA9D'
};

const COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.red,
  CHART_COLORS.purple,
  CHART_COLORS.teal
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [mediaClips, setMediaClips] = useState<MediaClip[]>([]);
  const [audioMessages, setAudioMessages] = useState<AudioMessage[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("7days");

  // Authentication check
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setParticipants(data.data.recent?.participants || []);

        // Ensure volunteers have skills array
        const processedVolunteers = data.data.recent?.volunteers?.map((volunteer: any) => ({
          ...volunteer,
          skills: volunteer.skills || [], // Ensure skills is always an array
          departments: volunteer.departments || [], // Ensure departments is always an array
        })) || [];

        setVolunteers(processedVolunteers);
        setSermons(data.data.recent?.sermons || []);
        setMediaClips(data.data.recent?.mediaClips || []);
        setAudioMessages(data.data.recent?.audioMessages || []);
        setTestimonies(data.data.recent?.testimonies || []);
        setAnalytics(data.data.analytics);
        setRecentActivities(data.data.recentActivities || []);
      } else {
        console.error("Dashboard API error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  // Action handlers
  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchDashboardData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const handleUpdateStatus = async (type: string, id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchDashboardData();
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  // Loading state
  if (isLoading || loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Chart data formatting
  const formatTrendData = () => {
    if (!analytics?.registrationTrends) return [];
    return analytics.registrationTrends.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: item.count,
      volunteers: Math.floor(item.count * 0.4),
      total: item.count + Math.floor(item.count * 0.4)
    }));
  };

  const formatTopSermonsData = () => {
    if (!analytics?.topSermons) return [];
    return analytics.topSermons.slice(0, 5).map(sermon => ({
      name: sermon.title.length > 20 ? sermon.title.substring(0, 20) + '...' : sermon.title,
      views: sermon.views,
      downloads: sermon.downloads
    }));
  };

  const formatTestimonyData = () => {
    if (!analytics?.testimonyStats) return [];
    return analytics.testimonyStats.map(stat => ({
      name: stat._id || 'Uncategorized',
      value: stat.count,
      pending: stat.pending,
      approved: stat.approved
    }));
  };

  // Filter data based on search
  const filteredParticipants = participants.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVolunteers = volunteers.filter(v =>
    `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.role && v.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.departments && v.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subtitle
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: number;
    subtitle?: string;
  }) => (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 bg-gradient-to-br ${color} rounded-full -translate-y-8 translate-x-8`} />
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <Badge variant={trend >= 0 ? "success" : "destructive"} className="gap-1">
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value.toLocaleString()}</div>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Admin"}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchDashboardData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Participants"
            value={stats.participants.total}
            icon={Users}
            color="from-blue-500 to-cyan-500"
            trend={stats.participants.growth.daily}
            subtitle={`${stats.participants.newToday} new today`}
          />
          <StatCard
            title="Active Volunteers"
            value={stats.volunteers.active}
            icon={UserCheck}
            color="from-green-500 to-emerald-500"
            trend={stats.volunteers.growth.daily}
          />
          <StatCard
            title="Sermon Views"
            value={stats.sermons.totalViews}
            icon={Eye}
            color="from-purple-500 to-pink-500"
            subtitle={`${stats.sermons.total} sermons`}
          />
          <StatCard
            title="Pending Testimonies"
            value={stats.testimonies.pending}
            icon={Clock}
            color="from-orange-500 to-red-500"
            subtitle={`${stats.testimonies.approved} approved`}
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Participants</span>
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Volunteers</span>
              </TabsTrigger>
              <TabsTrigger value="sermons" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Sermons</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="testimonies" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Testimonies</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Registration Trends</CardTitle>
                  <CardDescription>New registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formatTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="registrations"
                          stroke={CHART_COLORS.blue}
                          fill={CHART_COLORS.blue}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="volunteers"
                          stroke={CHART_COLORS.green}
                          fill={CHART_COLORS.green}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Sermons Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Sermons</CardTitle>
                  <CardDescription>Most viewed sermons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formatTopSermonsData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="downloads" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest activities across all modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 8).map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'participant' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            activity.type === 'volunteer' ? 'bg-green-100 dark:bg-green-900/30' :
                              activity.type === 'sermon' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                'bg-orange-100 dark:bg-orange-900/30'
                            }`}>
                            {activity.type === 'participant' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {activity.type === 'volunteer' && <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />}
                            {activity.type === 'sermon' && <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                            {activity.type === 'testimony' && <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                          </div>
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-gray-500">
                              {activity.type} • {new Date(activity.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.action}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  {filteredParticipants.length} participant{filteredParticipants.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Joined Date</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-3 font-medium">{participant.firstName} {participant.lastName}</div>
                      <div className="col-span-3 text-gray-600 dark:text-gray-400">{participant.email}</div>
                      <div className="col-span-2">{participant.phone}</div>
                      <div className="col-span-2">
                        {new Date(participant.createdAt).toLocaleDateString()}
                      </div>
                      <div className="col-span-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(
                                'participants',
                                participant._id,
                                participant.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              {participant.status === 'active' ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete('participants', participant._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <CardTitle>Volunteers</CardTitle>
                <CardDescription>
                  {filteredVolunteers.length} volunteer{filteredVolunteers.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email & Role</div>
                    <div className="col-span-2">Skills</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {filteredVolunteers.map((volunteer) => (
                    <div
                      key={volunteer._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-3 font-medium">{volunteer.firstName} {volunteer.lastName}</div>
                      <div className="col-span-3">
                        <div>{volunteer.email}</div>
                        <div className="text-sm text-gray-500">
                          {volunteer.role || (volunteer.departments?.join(", ")) || "Volunteer"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills?.slice(0, 2).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills && volunteer.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{volunteer.skills.length - 2}
                            </Badge>
                          )}
                          {(!volunteer.skills || volunteer.skills.length === 0) && (
                            <span className="text-xs text-gray-500">No skills</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant={volunteer.status === 'active' ? 'success' : 'secondary'}>
                          {volunteer.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(
                                'volunteers',
                                volunteer._id,
                                volunteer.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              {volunteer.status === 'active' ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete('volunteers', volunteer._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sermons Tab */}
          <TabsContent value="sermons">
            <Card>
              <CardHeader>
                <CardTitle>Sermons</CardTitle>
                <CardDescription>
                  {sermons.length} sermon{sermons.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-4">Title & Preacher</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Views</div>
                    <div className="col-span-2">Downloads</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {sermons.map((sermon) => (
                    <div
                      key={sermon._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-4">
                        <div className="font-medium">{sermon.title}</div>
                        <div className="text-sm text-gray-500">{sermon.preacher}</div>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">
                        {new Date(sermon.date).toLocaleDateString()}
                      </div>
                      <div className="col-span-2">{(sermon.views || 0).toLocaleString()}</div>
                      <div className="col-span-2">{(sermon.downloads || 0).toLocaleString()}</div>
                      <div className="col-span-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete('sermons', sermon._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {sermons.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No sermons found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
                <CardDescription>
                  {mediaClips.length} media clip{mediaClips.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Views</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {mediaClips.map((clip) => (
                    <div
                      key={clip._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-5 font-medium">{clip.title}</div>
                      <div className="col-span-2 capitalize">
                        <Badge variant="outline">{clip.type}</Badge>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">{clip.category}</div>
                      <div className="col-span-2">{clip.views.toLocaleString()}</div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete('media', clip._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {mediaClips.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No media clips found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>Audio Messages</CardTitle>
                <CardDescription>
                  {audioMessages.length} audio message{audioMessages.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-4">Title</div>
                    <div className="col-span-3">Speaker</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Plays</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {audioMessages.map((audio) => (
                    <div
                      key={audio._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-4 font-medium">{audio.title}</div>
                      <div className="col-span-3 text-sm text-gray-500">{audio.speaker}</div>
                      <div className="col-span-2 text-sm">
                        {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="col-span-2">{audio.plays.toLocaleString()}</div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete('audio', audio._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {audioMessages.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No audio messages found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonies Tab */}
          <TabsContent value="testimonies">
            <Card>
              <CardHeader>
                <CardTitle>Testimonies</CardTitle>
                <CardDescription>
                  {testimonies.length} testimonie{testimonies.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 dark:bg-gray-900 font-medium">
                    <div className="col-span-3">Author</div>
                    <div className="col-span-4">Content</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {testimonies.map((testimony) => (
                    <div
                      key={testimony._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="col-span-3">
                        <div className="font-medium">{testimony.author}</div>
                        <div className="text-xs text-gray-500">{testimony.title}</div>
                      </div>
                      <div className="col-span-4 text-sm text-gray-600 dark:text-gray-400">
                        {testimony.content.length > 50
                          ? `${testimony.content.substring(0, 50)}...`
                          : testimony.content}
                      </div>
                      <div className="col-span-2">
                        <Badge variant={
                          testimony.status === 'approved' ? 'success' :
                            testimony.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {testimony.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">
                        {new Date(testimony.createdAt).toLocaleDateString()}
                      </div>
                      <div className="col-span-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {testimony.status !== 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus('testimonies', testimony._id, 'approved')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {testimony.status !== 'rejected' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus('testimonies', testimony._id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete('testimonies', testimony._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {testimonies.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No testimonies found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Testimonies by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Testimonies by Category</CardTitle>
                  <CardDescription>Distribution of testimonies across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatTestimonyData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {formatTestimonyData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Overview</CardTitle>
                  <CardDescription>Platform engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formatTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke={CHART_COLORS.purple}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="registrations"
                          stroke={CHART_COLORS.blue}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Content Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Sermons</span>
                      <span className="font-semibold">{stats.sermons.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Media Clips</span>
                      <span className="font-semibold">{stats.media.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Audio Messages</span>
                      <span className="font-semibold">{stats.audio.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Views</span>
                      <span className="font-semibold">
                        {(stats.sermons.totalViews + stats.media.totalViews).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Audio Plays</span>
                      <span className="font-semibold">{stats.audio.totalPlays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Engagement</span>
                      <span className="font-semibold">{stats.overview.totalEngagement.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">People Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total People</span>
                      <span className="font-semibold">{stats.overview.totalPeople}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Volunteers</span>
                      <span className="font-semibold">{stats.volunteers.active}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Participants</span>
                      <span className="font-semibold">{stats.participants.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}