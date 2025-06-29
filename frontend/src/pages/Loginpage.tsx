import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Moon, Sun, Video, Sparkles, Zap, Heart } from "lucide-react";
import { TailCursor } from "../components/Tail-cursor";
import {
  NotificationProvider,
  useNotifications,
} from "../components/Notification-system";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../service/firebase";
import API from "../service/api";

import { useAuthStore } from "../store/useAuthStore";

const LoginContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

   const { login, isLoggingIn , authUser } = useAuthStore();
   


  // (only the changed portion)

 const handleGoogleSignIn = async () => {
  setIsLoading(true);

  try {
    addNotification({
      type: "info",
      title: "Signing In",
      message: "Connecting to your Google account...",
    });

    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const response = await API.googleauth({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
      const mongoUser = response.data.user;
     console.log(mongoUser , ' user from loginpage')
    //  send data to authstore
     await login(mongoUser);
      
        
    addNotification({
      type: "success",
      title: "Welcome to MediCall!",
      message: "Successfully signed in. Redirecting to dashboard...",
    });
      setIsLoading(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  } catch (err: any) {
    
    addNotification({
      type: "error",
      title: "Authentication Failed",
      message: err.message,
    });
  
   } 
    
  
};


  return (
    <div className="min-h-screen signin-bg flex items-center justify-center p-4 relative overflow-hidden">
      <TailCursor />
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 text-white"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/10 border border-white/20 animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center glow bounce">
            <Video className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold text-white">MediCall</CardTitle>
            <CardDescription className="text-lg mt-2 flex items-center justify-center space-x-2 text-blue-100">
              <Sparkles className="w-4 h-4" />
              <span>Advanced Real-Time Emotion Analyzer</span>
              <Sparkles className="w-4 h-4" />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white glow ripple"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
          </div>

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-blue-200">
                <Heart className="w-4 h-4" />
                <span>Real-time emotions</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-200">
                <Zap className="w-4 h-4" />
                <span>Face swap</span>
              </div>
            </div>
            <p className="text-xs text-blue-100">
              Experience the future of video calling with AI-powered emotion recognition
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <NotificationProvider>
      <LoginContent />
    </NotificationProvider>
  );
};

export default LoginPage;
