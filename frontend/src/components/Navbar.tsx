import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useNotifications } from "../components/Notification-system";
import { useAuthStore  } from "../store/useAuthStore"; // ✅ use authUser from zustand
import { signOut } from "firebase/auth";
import { auth } from "../service/firebase";
import { createMeetingRoom } from "../utils/create-meeting";

export function Navbar() {
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();

  const isActive = (path) => location.pathname === path;

  const { authUser, logout } = useAuthStore(); // ✅ use authUser and logout

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleJoinMeeting = async() => {
   
    
    addNotification({
      type: "info",
      title: "Joining Meeting",
      message: `Setting camera and mic access`,
    })
    setTimeout(() => {
      navigate(`/preJoin`);
    }, 1000)
  }

  const handleNewMeeting = async() => {
    const meetingId = await createMeetingRoom(authUser._id);
    addNotification({
      type: "success",
      title: "Meeting Created",
      message: `New meeting ${meetingId} created successfully!`,
    })

    setTimeout(() => {
      navigate(`/preJoin/${meetingId}`);
    }, 1000)
  }

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


  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
    { href: "/help", label: "Help", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className=" z-50 glass backdrop-blur-md border-b ">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer ripple" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center glow">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MediCall
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Emotion-Powered Calls</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.href)}
                className={`glass glow ripple ${isActive(item.href) ? "bg-primary/20" : ""}`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button onClick={handleJoinMeeting} variant="outline" size="sm" className="glass glow ripple">
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="glass glow ripple"
            >
              <Sun className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-0" : "scale-100"}`} />
              <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-100" : "scale-0"}`} />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="glass glow ripple">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border rounded-md shadow-md  w-56 ">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authUser?.photoURL || "/profile.jpg"} />
                    <AvatarFallback>
                      {authUser?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{authUser?.username}</p>
                    <p className="text-xs text-muted-foreground">{authUser?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profilepage")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glass glow ripple"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        {/* ... mobile menu stays the same */}
      </div>
    </nav>
  );
}
