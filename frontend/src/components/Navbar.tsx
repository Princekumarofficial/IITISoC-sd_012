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

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleNewMeeting = () => {
    const meetingId = Math.random().toString(36).substring(7);
    addNotification({
      type: "success",
      title: "Meeting Created",
      message: `New meeting ${meetingId} created successfully!`,
    });
    setTimeout(() => {
      navigate(`/meeting/${meetingId}`);
    }, 1000);
  };

  const handleJoinMeeting = () => {
    const meetingId = Math.random().toString(36).substring(7);
    addNotification({
      type: "info",
      title: "Joining Meeting",
      message: `Connecting to meeting ${meetingId}...`,
    });
    setTimeout(() => {
      navigate(`/meeting/${meetingId}`);
    }, 1000);
  };

  const handleSignOut = () => {
    addNotification({
      type: "info",
      title: "Signing Out",
      message: "See you next time!",
    });
    setTimeout(() => navigate("/"), 1000);
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
    { href: "/help", label: "Help", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b ">
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
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 glow ripple"
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
                    <AvatarImage src="/profile.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-56">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/profile.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t glass backdrop-blur-md animate-slide-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start glass glow ripple ${isActive(item.href) ? "bg-primary/20" : ""}`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}

              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => {
                    handleJoinMeeting();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full glass glow ripple"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
                <Button
                  onClick={() => {
                    handleNewMeeting();
                    setIsMobileMenuOpen(false);
                  }}
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 glow ripple"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </Button>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/profile.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="glass glow ripple"
                  >
                    <Sun className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-0" : "scale-100"}`} />
                    <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-100" : "scale-0"}`} />
                  </Button>
                </div>

                <div className="mt-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start glass glow ripple"
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start glass glow ripple"
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive glass glow ripple"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
