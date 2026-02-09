"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Users,
  UserCheck,
  Clock,
  RefreshCw,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  QrCode,
  Loader2,
  Bell,
  BellOff,
  Filter,
  UserCog,
  Shield
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { toast } from "sonner";

interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: "participant" | "volunteer" | "staff";
  isConfirmed: boolean;
  status: "active" | "pending" | "rejected" | "inactive";
  registrationCode?: string;
  campDate?: string;
  createdAt: string;
  lastUpdated: string;
  notes?: string;
  checkInStatus?: boolean;
  checkInTime?: string;
  isLeader?: string;
  ministry?: string;
  departments?: string[];
}

interface Stats {
  total: number;
  participants: number;
  volunteers: number;
  staff: number;
  confirmed: number;
  pending: number;
  checkedIn: number;
  todayRegistrations: number;
}

export default function AdvancedPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    participants: 0,
    volunteers: 0,
    staff: 0,
    confirmed: 0,
    pending: 0,
    checkedIn: 0,
    todayRegistrations: 0,
  });
  const [viewPerson, setViewPerson] = useState<Person | null>(null);

  // Real-time state
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const wsRef = useRef<WebSocket | null>(null);

  // Function to calculate stats from people data
  const calculateStats = useCallback((peopleData: Person[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let participants = 0;
    let volunteers = 0;
    let staff = 0;
    let confirmed = 0;
    let checkedIn = 0;
    let todayRegistrations = 0;

    peopleData.forEach(person => {
      // Count by type
      if (person.type === 'participant') participants++;
      if (person.type === 'volunteer') volunteers++;
      if (person.type === 'staff' || person.isLeader === 'yes') staff++;

      // Count confirmed (only for participants and volunteers)
      if (person.isConfirmed && (person.type === 'participant' || person.type === 'volunteer')) {
        confirmed++;
      }

      // Count checked in
      if (person.checkInStatus) checkedIn++;

      // Count today's registrations
      const createdAt = new Date(person.createdAt);
      if (createdAt >= today) todayRegistrations++;
    });

    return {
      total: peopleData.length,
      participants,
      volunteers,
      staff,
      confirmed,
      pending: (participants + volunteers) - confirmed, // Update pending logic to match
      checkedIn,
      todayRegistrations
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedType && selectedType !== 'all') params.set('type', selectedType);

      const response = await fetch(`/api/admin/people?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        const newPeople = data.data.people || [];

        if (!Array.isArray(newPeople)) {
          console.error('Expected array but got:', newPeople);
          setPeople([]);
          setStats(calculateStats([]));
          return;
        }

        setPeople(newPeople);

        // Calculate stats from the actual data we received
        const calculatedStats = calculateStats(newPeople);
        setStats(calculatedStats);

        setLastUpdate(new Date());

        // Debug logging
        console.log('Fetched data:', {
          total: newPeople.length,
          calculatedStats,
          samplePerson: newPeople[0]
        });

      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
      setPeople([]);
      setStats(calculateStats([]));
    } finally {
      setLoading(false);
    }
  }, [selectedType, calculateStats]); // Removed selectedStatus dependency

  // Real-time WebSocket connection
  const setupRealTimeConnection = useCallback(() => {
    if (!realTimeEnabled) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws/registrations`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        toast.success("Real-time mode enabled");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'new_registration') {
            const person = data.data;
            toast.info('New Registration', {
              description: `${person.firstName} ${person.lastName} registered`,
            });

            // Add new person and recalculate stats
            setPeople(prev => {
              const updated = [person, ...prev];
              setStats(calculateStats(updated));
              return updated;
            });

          } else if (data.type === 'confirmation_update') {
            const { personId, isConfirmed } = data.data;
            setPeople(prev => {
              const updated = prev.map(p =>
                p._id === personId ? { ...p, isConfirmed } : p
              );
              setStats(calculateStats(updated));
              return updated;
            });
          } else if (data.type === 'checkin_update') {
            const { personId, checkInStatus } = data.data;
            setPeople(prev => {
              const updated = prev.map(p =>
                p._id === personId ? {
                  ...p,
                  checkInStatus,
                  checkInTime: checkInStatus ? new Date().toISOString() : undefined
                } : p
              );
              setStats(calculateStats(updated));
              return updated;
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        if (realTimeEnabled) {
          setTimeout(() => setupRealTimeConnection(), 5000);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket setup failed:', error);
    }
  }, [realTimeEnabled, calculateStats]);

  useEffect(() => {
    fetchData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchData]);

  useEffect(() => {
    setupRealTimeConnection();
  }, [setupRealTimeConnection]);

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const matchesSearch =
        searchQuery === "" ||
        person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.registrationCode?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !selectedType || selectedType === 'all' || person.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [people, searchQuery, selectedType]); // Removed selectedStatus dependency

  const handleBulkAction = async (action: string) => {
    if (selectedPeople.length === 0) {
      toast.warning("Please select people first");
      return;
    }

    try {
      const endpoint = '/api/admin/people';
      const method = 'POST';

      switch (action) {
        case "confirm":
          await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedPeople, action: 'confirm' }),
          });
          toast.success(`Confirmed ${selectedPeople.length} people`);
          break;

        case "check_in":
          await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedPeople, action: 'checkin' }),
          });
          toast.success(`Checked in ${selectedPeople.length} people`);
          break;

        case "delete":
          const confirmDelete = window.confirm(`Delete ${selectedPeople.length} selected people?`);
          if (confirmDelete) {
            await fetch(endpoint, {
              method: 'DELETE',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: selectedPeople }),
            });
            toast.success(`Deleted ${selectedPeople.length} people`);
          }
          break;
      }

      setSelectedPeople([]);
      fetchData();
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  const exportData = () => {
    const headers = ["Name", "Email", "Phone", "Type", "Status", "Confirmed", "Check-in", "Created At"];
    const rows = filteredPeople.map(p => [
      `${p.firstName} ${p.lastName}`,
      p.email,
      p.phone || "",
      p.type,
      p.status,
      p.isConfirmed ? "Yes" : "No",
      p.checkInStatus ? "Yes" : "No",
      new Date(p.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(row =>
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredPeople.length} records`);
  };

  const toggleSelectAll = () => {
    if (selectedPeople.length === filteredPeople.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(filteredPeople.map(p => p._id));
    }
  };

  const togglePersonSelection = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "rejected": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "participant": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "volunteer": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "staff": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  // Removed confirmPerson as all registrations are auto-confirmed.
  // Using checkInPerson as the primary arrival action.


  const checkInPerson = async (personId: string) => {
    try {
      const response = await fetch(`/api/admin/people/${personId}/checkin`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to check in');

      const data = await response.json();

      if (data.success) {
        // Update local state
        setPeople(prev => prev.map(p =>
          p._id === personId ? {
            ...p,
            checkInStatus: true,
            checkInTime: new Date().toISOString()
          } : p
        ));

        // Recalculate stats
        setStats(prev => ({
          ...prev,
          checkedIn: prev.checkedIn + 1
        }));

        // Real-time update
        if (realTimeEnabled && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'checkin_update',
            data: { personId, checkInStatus: true }
          }));
        }

        toast.success('Checked in successfully');
      } else {
        throw new Error(data.error || 'Failed to check in');
      }
    } catch (error) {
      console.error('Failed to check in:', error);
      toast.error('Failed to check in');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">People Management</h1>
            {realTimeEnabled && (
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 animate-pulse border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage {stats.total} registrations • Updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={realTimeEnabled}
              onCheckedChange={setRealTimeEnabled}
              id="realtime-mode"
            />
            <Label htmlFor="realtime-mode" className="flex items-center gap-2 cursor-pointer text-sm">
              {realTimeEnabled ? <Bell className="w-4 h-4 text-green-600" /> : <BellOff className="w-4 h-4" />}
              <span className={realTimeEnabled ? "text-green-600 font-medium" : ""}>
                Live
              </span>
            </Label>
          </div>

          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button onClick={exportData} size="sm" className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.participants} participants • {stats.volunteers} volunteers
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed (P&V)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.confirmed}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.pending} pending
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Checked In</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.checkedIn}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.total - stats.checkedIn} remaining
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.todayRegistrations}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  New registrations
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="participant">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Participants
                    </div>
                  </SelectItem>
                  <SelectItem value="volunteer">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Volunteers
                    </div>
                  </SelectItem>
                  <SelectItem value="staff">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Staff
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          {/* Selected Actions */}
          {selectedPeople.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedPeople.length} selected
                  </span>
                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("check_in")}
                      className="border-gray-300 dark:border-gray-700"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Check In
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("delete")}
                      className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPeople([])}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* People Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-100">People</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {filteredPeople.length} found • {selectedPeople.length} selected
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
              className="border-gray-300 dark:border-gray-700"
            >
              {selectedPeople.length === filteredPeople.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPeople.length === filteredPeople.length && filteredPeople.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 checked:bg-green-600"
                    />
                  </th>
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Email</th>
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => (
                  <tr
                    key={person._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedPeople.includes(person._id)}
                        onChange={() => togglePersonSelection(person._id)}
                        className="rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 checked:bg-green-600"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-gray-100 dark:bg-gray-800">
                          <AvatarFallback className="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700">
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {person.firstName} {person.lastName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {person.phone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {person.email}
                      </div>
                    </td>

                    <td className="p-3">
                      <Badge className={getTypeColor(person.type)}>
                        {person.type}
                      </Badge>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(person.status)}>
                          {person.status}
                        </Badge>
                        {person.isConfirmed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setViewPerson(person)}
                                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-300">
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>



                        {!person.checkInStatus && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => checkInPerson(person._id)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                >
                                  <Clock className="w-4 h-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-300">
                                <p>Check In</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPeople.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No people found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Person Dialog */}
      {viewPerson && (
        <Dialog open={!!viewPerson} onOpenChange={() => setViewPerson(null)}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-gray-100 dark:bg-gray-800">
                  <AvatarFallback className="text-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {viewPerson.firstName?.[0]}{viewPerson.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">
                    {viewPerson.firstName} {viewPerson.lastName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {viewPerson.type} • {viewPerson.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      {viewPerson.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {viewPerson.phone || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration</p>
                  <div className="space-y-1">
                    <Badge className={getStatusColor(viewPerson.status)}>
                      {viewPerson.status}
                    </Badge>
                    {viewPerson.registrationCode && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        Code: {viewPerson.registrationCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {viewPerson.isConfirmed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {viewPerson.isConfirmed ? "Confirmed" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {viewPerson.checkInStatus ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {viewPerson.checkInStatus ? "Checked In" : "Not Checked In"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setViewPerson(null)}
                  className="flex-1 border-gray-300 dark:border-gray-700"
                >
                  Close
                </Button>
                {!viewPerson.checkInStatus && (
                  <Button
                    onClick={() => {
                      checkInPerson(viewPerson._id);
                      setViewPerson(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Check In
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}