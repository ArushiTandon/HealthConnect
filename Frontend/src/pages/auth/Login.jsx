import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../hooks/use-toast.js";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  console.log("Logged in user:", user);

useEffect(() => {
  if (isAuthenticated && user) {
    console.log("Redirecting based on role:", user.role);

    if (user.role === 'hospital') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }
}, [isAuthenticated, navigate, user]);


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await login(email, password, role); 

    toast({
      title: "Success",
      description: "Successfully logged in!",
    });
    console.log("Logged in user:", user);


    
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Login failed",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your healthcare portal</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              {/* Signup Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;