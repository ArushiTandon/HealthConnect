import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Heart, Shield, Check, X } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const passwordValid = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !passwordValid) {
      return;
    }
    console.log("Signup attempt:", { email, role });
    // Add signup logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h1>
          <p className="text-gray-600">Create your healthcare portal account</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                <RadioGroup
                  value={role}
                  onValueChange={setRole}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="text-sm text-gray-700 cursor-pointer">
                      Patient/User
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="text-sm text-gray-700 cursor-pointer flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Hospital Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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
                    placeholder="Create a strong password"
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
                {password && (
                  <div className="flex items-center space-x-2 text-xs">
                    {passwordValid ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordValid ? "text-green-600" : "text-red-500"}>
                      At least 8 characters
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {passwordsMatch ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordsMatch ? "text-green-600" : "text-red-500"}>
                      Passwords match
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!passwordsMatch || !passwordValid}
                className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Sign in here
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

export default Signup;