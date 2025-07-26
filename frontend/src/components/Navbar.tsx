import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/Dropdown-menu";
import {
  Video,
  Plus,
  Users,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Info,
  HelpCircle,
  Smile,
  Star,
  Trophy,
  History,
} from "lucide-react";
import { useNotifications } from "../components/Notification-system";
import { useAuthStore } from "../store/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "../service/firebase";
import { createMeetingRoom } from "../utils/create-meeting";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const { authUser, logout } = useAuthStore();
 
  const [activeTab, setActiveTab] = useState("history")

  const [showProfile, setShowProfile] = useState(false)
  const [showCameraTest, setShowCameraTest] = useState(false)
  const [showCallDetails, setShowCallDetails] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [allCalls, setAllCalls] = useState<any[]>([])
  
  // Init theme based on OS setting
  useEffect(() => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    setTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const defaultTheme = prefersDark ? "dark" : "light";
    setTheme(defaultTheme);
    localStorage.setItem("theme", defaultTheme);
  }
}, []);


  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = useMemo(
    () => (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleJoinMeeting = async () => {
    addNotification({
      type: "info",
      title: "Joining Meeting",
      message: `Setting camera and mic access`,
    });
    setTimeout(() => {
      navigate(`/preJoin`);
    }, 1000);
  };

  const handleNewMeeting = async () => {
    const meetingId = await createMeetingRoom(authUser._id);
    addNotification({
      type: "success",
      title: "Meeting Created",
      message: `New meeting ${meetingId} created successfully!`,
    });

    setTimeout(() => {
      navigate(`/preJoin/${meetingId}`);
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      addNotification({
        type: "info",
        title: "Signing Out",
        message: "See you next time!",
      });
      await logout();

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Sign out error:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to sign out. Please try again.",
      });
    }
  };


  

useEffect(() => {
  if (location.hash) {
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}, [location.hash]);
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { href: "/profilepage", label: "Profile", icon: <User className="w-4 h-4" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
    { href: "/help", label: "Help", icon: <HelpCircle className="w-4 h-4" /> },
    // { href: "/dashboard#callhistory", label: "Call History", icon: <History className="w-4 h-4" /> },
    
  ];

  return (
    <nav className="sticky top-0  w-full z-50 bg-background/60 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/40">
      <div className="container  mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
          aria-label="Go to dashboard"
            className="flex items-center space-x-3 cursor-pointer ripple"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center glow">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MediCall
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Emotion-Powered Calls
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.href)}
                className={`glass glow ripple ${
                  isActive(item.href) ? "bg-primary/20" : ""
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Button
              onClick={handleJoinMeeting}
              variant="outline"
              size="sm"
              className="glass glow ripple"
            >
              <Users className="w-4 h-4 mr-2" />
              Join
            </Button>
            <Button
              onClick={handleNewMeeting}
              size="sm"
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 glow2 ripple"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              localStorage.setItem("theme", newTheme);
            }}

              className="glass glow ripple relative"
              aria-label="Toggle theme"
            >
              <Sun
                className={`h-4 w-4 transition-all ${
                  theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              />
              <Moon
                className={`absolute h-4 w-4 transition-all ${
                  theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="glass glow ripple">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background border border-border rounded-md shadow-md w-56"
              >
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{authUser?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {authUser?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profilepage")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glass glow ripple"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu (Slide-down) */}
       
        <div
          id="mobile-nav"
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          
          <div className="p-3 space-y-2 border-t">
            <div className="flex justify-center items-center w-full">
              <div>


          {/* Links */}
            {navItems.map((item) => (
              <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate(item.href)}
              className={`w-full justify-start glass ripple ${
                isActive(item.href) ? "bg-primary/20" : ""
                }`}
                >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
                </div>
                <div className="p-5 yourstats">
                   <div className=" md:block w-64 space-y-4 slide-in-left">
              {/* <Card className=" glass glow breathe">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "history" ? "secondary" : "ghost"}
                      className="w-full justify-start ripple"
                      onClick={() => setActiveTab("history")}
                    >
                      <History className="w-4 h-4 mr-2" />
                      Call History
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => setShowProfile(true)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => setShowCameraTest(!showCameraTest)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Camera Test
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start ripple"
                      onClick={() => navigate("/chat")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </nav>
                </CardContent>
              </Card> */}

              {/* Quick Stats */}
              <Card className="glass glow breathe">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Calls</span>
                    <Badge variant="secondary">{allCalls.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Happy Moments</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Smile className="w-3 h-3 mr-1" />
                      92%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Level</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Star className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleJoinMeeting}
                variant="outline"
                size="sm"
                className="flex-1 glass glow ripple"
              >
                <Users className="w-4 h-4 mr-2" />
                Join
              </Button>
              <Button
                onClick={handleNewMeeting}
                size="sm"
                className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 glow2 ripple"
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            {/* Theme toggle + profile quick actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="glass glow ripple"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="glass ripple"
                >
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
              </div>
            </div>

            {/* Profile summary + signout */}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                  <AvatarFallback>
                    {authUser?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">
                    {authUser?.username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {authUser?.email}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-destructive w-full justify-start ripple"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
