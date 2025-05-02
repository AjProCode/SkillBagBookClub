import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SkillbagLogo } from "@/components/ui/skillbag-logo";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  age: z.string().refine((val) => {
    const age = parseInt(val);
    return !isNaN(age) && age >= 8 && age <= 16;
  }, "Age must be between 8 and 16"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if user is already logged in - using useEffect to avoid state updates during render
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      age: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate("/");
      }
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, age, ...registrationData } = values;
    
    registerMutation.mutate(registrationData, {
      onSuccess: () => {
        toast({
          title: "Registration successful!",
          description: "Welcome to BookBuddy!",
        });
        navigate("/");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Auth Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div>
                  <img 
                    src="/assets/skillbag-logo.png"
                    alt="Skillbag Logo"
                    width={220}
                    height={60}
                    style={{ 
                      objectFit: 'contain', 
                      display: 'inline-block', 
                      verticalAlign: 'middle' 
                    }}
                  />
                </div>
              </div>
              <p className="text-gray-600">Join our community of young readers!</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login" className="font-heading">Login</TabsTrigger>
                <TabsTrigger value="register" className="font-heading">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Welcome Back!</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary font-heading" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Create an Account</CardTitle>
                    <CardDescription>Start your reading journey today!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Your Age</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Enter your age (8-16)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heading">Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-secondary font-heading" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Sign Up"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Hero Section */}
          <div className="w-full md:w-1/2 bg-secondary text-white p-8 flex flex-col justify-center">
            <h2 className="font-heading font-bold text-3xl mb-4">Discover the Joy of Reading!</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Find books perfect for your age and interests</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Track your reading progress and set goals</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Share your thoughts and read reviews</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Earn badges and rewards for reading</span>
              </li>
            </ul>
            <div className="mt-8 bg-white bg-opacity-20 rounded-xl p-4">
              <div className="flex items-center">
                <div className="bg-secondary text-white p-2 rounded-lg">
                  <i className="ri-star-fill"></i>
                </div>
                <p className="ml-3 font-medium">Premium Subscription: ₹3000 for 3 months!</p>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1515940175183-6b248b0f53ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Teenage student reading" 
              className="mt-8 rounded-xl self-center max-w-full shadow-lg border-2 border-white/20" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
