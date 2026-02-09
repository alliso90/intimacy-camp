"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  User,
  Mail,
  Phone,
  Hash,
  CheckSquare,
  Clock,
  CalendarDays,
  Home,
  Heart,
  Users,
  Building,
  Shield,
  Star
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ROUTES } from "@/src/lib/constants";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { toast } from "sonner";

interface Registration {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  registrationType: "participant" | "volunteer";
  registrationCode: string;
  gender: string;
  maritalStatus: string;
  address: string;
  isLeader: string;
  ministry?: string;
  customMinistry?: string;
  departments?: string[];
  isConfirmed: boolean;
  checkInStatus: boolean;
  checkInTime?: string;
  createdAt: string;
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    registrations: Registration[];
    count: number;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState<string | null>(null);

  useEffect(() => {
    const performAutoCheckIn = async () => {
      if (token) {
        setStatus("loading");
        try {
          const response = await fetch("/api/register/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registrationCode: token, action: "check-in" }),
          });
          const data = await response.json();
          if (data.success) {
            setStatus("success");
            setMessage("Check-in successful! Welcome to Intimacy Camp.");
          } else {
            setStatus("error");
            setMessage(data.error || "Failed to check in.");
          }
        } catch (error) {
          console.error("Auto check-in error:", error);
          setStatus("error");
          setMessage("Something went wrong during check-in.");
        }
      }
    };
    performAutoCheckIn();
  }, [token]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const response = await fetch(`/api/register/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResult(data.data);
      } else {
        setSearchResult({ registrations: [], count: 0 });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResult({ registrations: [], count: 0 });
    } finally {
      setSearching(false);
    }
  };

  const handleCheckIn = async (registrationId: string, registrationCode: string) => {
    setIsCheckingIn(registrationId);
    try {
      const response = await fetch(`/api/register/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check-in" }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        if (searchResult) {
          const updatedRegistrations = searchResult.registrations.map(reg =>
            reg._id === registrationId ? {
              ...reg,
              checkInStatus: true,
              checkInTime: new Date().toISOString()
            } : reg
          );
          setSearchResult({
            ...searchResult,
            registrations: updatedRegistrations
          });
        }
        toast.success("Check-in successful!");
      } else {
        toast.error(data.error || "Failed to check in.");
      }
    } catch (error) {
      toast.error("Failed to check in. Please try again.");
    } finally {
      setIsCheckingIn(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDepartmentIcon = (dept: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icons: Record<string, any> = {
      'media': '📷',
      'protocol': '🎖️',
      'logistics': '📦',
      'welfare': '❤️',
      'technical': '💻',
      'security': '🛡️',
      'registration': '📝',
      'prayer': '🙏',
      'creative': '🎨',
      'medical': '🏥'
    };
    return icons[dept] || '👥';
  };

  const getMinistryIcon = (ministry: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icons: Record<string, any> = {
      'worship': '🎵',
      'prayer': '🙏',
      'teaching': '📖',
      'evangelism': '🗣️',
      'children': '👶',
      'youth': '👨‍🎓',
      'women': '👩',
      'men': '👨',
      'media': '📷',
      'hospitality': '🏠',
      'intercession': '🔥',
      'prophetic': '👁️',
      'apostolic': '🌍',
      'other': '🌟'
    };
    return icons[ministry] || '🌟';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              YMR
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            YMR 2025
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Participant Check-In
          </p>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Search for registrations by name, email, phone, or registration code
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8"
        >
          {token ? (
            // Token-based confirmation (kept for backward compatibility)
            <div className="text-center py-8">
              {status === "loading" && (
                <div className="py-12">
                  <Loader2 className="w-16 h-16 mx-auto text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="py-8"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Registration Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">{message}</p>
                  <Link href={ROUTES.LOGIN}>
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="py-8"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Error
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">{message}</p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/confirm">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6">
                        Search Registrations
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Search-based check-in
            <div>
              {/* Search Box */}
              <div className="mb-8">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, phone, or registration code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-12 h-14 text-lg rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={searching || !searchQuery.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-14 rounded-xl"
                    size="lg"
                  >
                    {searching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-1">
                  Tip: Search by registration code (e.g., PAR-123273-DJST) or email
                </p>
              </div>

              {/* Search Results */}
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Search Results ({searchResult.count})
                    </h3>
                    {searchResult.count > 0 && (
                      <Badge variant="outline" className="text-sm">
                        {searchResult.registrations.filter(r => r.checkInStatus).length} Checked In
                      </Badge>
                    )}
                  </div>

                  {searchResult.count === 0 ? (
                    <Card className="border-2 border-dashed border-gray-200">
                      <CardContent className="py-12 text-center">
                        <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium text-lg mb-2">No registrations found</p>
                        <p className="text-gray-500">
                          Try a different search term or check your spelling
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {searchResult.registrations.map((reg) => (
                        <Card key={reg._id} className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Left Column - User Info */}
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <div className={`p-3 rounded-full ${reg.registrationType === 'volunteer'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <User className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                    {/* Name and Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                      <h4 className="text-xl font-bold text-gray-900">
                                        {reg.firstName} {reg.lastName}
                                      </h4>
                                      <Badge
                                        className={
                                          reg.registrationType === 'volunteer'
                                            ? 'bg-orange-100 text-orange-800 border-orange-200'
                                            : 'bg-blue-100 text-blue-800 border-blue-200'
                                        }
                                      >
                                        {reg.registrationType === 'volunteer' ? 'Volunteer' : 'Participant'}
                                      </Badge>

                                      {reg.isLeader === 'yes' && (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                          <Star className="w-3 h-3 mr-1" />
                                          Leader
                                        </Badge>
                                      )}

                                      {/* Auto-confirmed badge */}
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Confirmed
                                      </Badge>

                                      {reg.checkInStatus && (
                                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                          <CheckSquare className="w-3 h-3 mr-1" />
                                          Checked In
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{reg.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{reg.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Hash className="w-4 h-4" />
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                          {reg.registrationCode}
                                        </code>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Home className="w-4 h-4" />
                                        <span className="truncate">{reg.address}</span>
                                      </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Users className="w-4 h-4 text-gray-400" />
                                          <span className="text-gray-600">Gender: </span>
                                          <span className="font-medium capitalize">{reg.gender}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Heart className="w-4 h-4 text-gray-400" />
                                          <span className="text-gray-600">Status: </span>
                                          <span className="font-medium capitalize">{reg.maritalStatus}</span>
                                        </div>
                                      </div>

                                      {/* Ministry or Departments */}
                                      {reg.registrationType === 'volunteer' && reg.departments && (
                                        <div className="mt-3">
                                          <p className="text-sm text-gray-500 mb-2">Departments:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {reg.departments.map((dept, index) => (
                                              <Badge key={index} variant="secondary" className="text-sm">
                                                {getDepartmentIcon(dept)} {dept.charAt(0).toUpperCase() + dept.slice(1)}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {reg.registrationType === 'participant' && reg.ministry && reg.ministry.trim() !== "" && (
                                        <div className="mt-3">
                                          <p className="text-sm text-gray-500 mb-2">Ministry:</p>
                                          <Badge variant="outline" className="text-sm">
                                            {getMinistryIcon(reg.ministry)} {
                                              reg.ministry === 'other' && reg.customMinistry
                                                ? reg.customMinistry
                                                : reg.ministry.charAt(0).toUpperCase() + reg.ministry.slice(1)
                                            }
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column - Actions */}
                              <div className="md:w-48 flex flex-col gap-3">
                                {/* Registration Date */}
                                <div className="text-sm text-gray-500">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>Registered:</span>
                                  </div>
                                  <div className="text-gray-700 font-medium">
                                    {formatDate(reg.createdAt)}
                                  </div>
                                </div>

                                {/* Check-in Time */}
                                {reg.checkInTime && (
                                  <div className="text-sm text-gray-500">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock className="w-4 h-4" />
                                      <span>Checked In:</span>
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                      {formatDate(reg.checkInTime)}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 mt-2">
                                  {/* Action button */}
                                  {!reg.checkInStatus ? (
                                    <Button
                                      onClick={() => handleCheckIn(reg._id, reg.registrationCode)}
                                      disabled={isCheckingIn === reg._id}
                                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full sm:w-auto"
                                    >
                                      {isCheckingIn === reg._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      ) : (
                                        <CheckSquare className="w-4 h-4 mr-2" />
                                      )}
                                      Check In
                                    </Button>
                                  ) : (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 py-2 px-4 text-sm">
                                      <CheckSquare className="w-4 h-4 mr-2" />
                                      Checked In
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* No Search Results Yet */}
              {!searchResult && (
                <div className="mt-8 text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Search className="w-12 h-12 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Search Registrations
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Enter a name, email, phone number, or registration code to find and check-in participants.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href={ROUTES.REGISTER}>
                        <Button variant="outline">
                          Register Someone New
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="ghost">
                          Go to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading check-in page...</p>
        </div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}