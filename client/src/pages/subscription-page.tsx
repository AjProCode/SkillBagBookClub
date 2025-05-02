import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Check, BookOpen, Truck, Users, Target, MessageSquare, TrendingUp, Package, Star, Gift, Award } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

type PlanType = "monthly" | "quarterly" | "biannual" | "annual";

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  recommended?: boolean;
  discount?: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Only premium plan is available

  const premiumPlan = {
    id: "premium_plan",
    name: "Premium",
    price: 3000,
    originalPrice: 3597,
    period: "3 months",
    discount: "SAVE ₹597",
  };

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/subscribe", {
        planId: premiumPlan.id,
        price: premiumPlan.price,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Started!",
        description: "Thank you for joining our Book Club. We'll contact you soon for delivery details.",
      });
      // Refresh page to update user state
      window.location.href = "/";
    },
  });

  const handleSubscribe = () => {
    subscribeMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="py-12 bg-secondary text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Develop a Love for Reading in Your Child</h2>
            <p className="max-w-3xl mx-auto text-lg text-white/90">
              Join our Book Club for ages 7 and above, where we make reading fun, engaging, and rewarding!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-accent/10 p-8 rounded-2xl border border-white/20">
              <h3 className="font-heading text-xl font-bold mb-6">Here's how it works:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-accent/30 p-2 rounded-full mr-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Personalized Book Selection</h4>
                    <p className="text-white/90">Our experts carefully select books tailored to your child's interests and reading level.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-accent/30 p-2 rounded-full mr-4">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Convenient Delivery</h4>
                    <p className="text-white/90">Every month, 3 exciting books will be delivered right to your doorstep.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-accent/30 p-2 rounded-full mr-4">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Flexible Reading Schedule</h4>
                    <p className="text-white/90">Your child will have ample time to enjoy and complete the books before we schedule a hassle-free pickup.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-accent/30 p-2 rounded-full mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Interactive Book Buddy</h4>
                    <p className="text-white/90">Regular interactions with a dedicated book buddy to keep your child motivated.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-8 rounded-2xl border border-white/20">
              <h3 className="font-heading text-xl font-bold mb-6">Benefits for your child:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/30 p-2 rounded-full mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Goal Setting</h4>
                    <p className="text-white/90">We help set achievable reading targets to encourage steady progress.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/30 p-2 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Engaging Book Discussions</h4>
                    <p className="text-white/90">After finishing each book, your child will participate in lively discussions to deepen their understanding.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/30 p-2 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Progressive Reading Levels</h4>
                    <p className="text-white/90">We gradually increase the complexity of books to match your child's growing reading skills.</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary/20 rounded-lg border border-white/10">
                  <p className="text-sm italic text-white/95">
                    Studies show that a child begins to enjoy reading in about 3 months, and a solid reading habit forms between 6 to 9 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-secondary text-white text-center py-6">
              <h3 className="font-heading font-bold text-2xl">Premium Subscription Plan</h3>
              <p className="text-white/80 mt-2">The perfect reading journey for your child</p>
            </div>
            
            <div className="p-8">
              <div className="bg-secondary/5 rounded-xl p-8 relative border-2 border-secondary/10 transition-all hover:border-primary hover:shadow-lg">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg rounded-tr-xl">
                  PREMIUM PLAN
                </div>
                
                <div className="text-center mb-8">
                  <h4 className="font-heading font-bold text-2xl text-gray-800">{premiumPlan.name} Plan</h4>
                  <div className="mt-4">
                    {premiumPlan.originalPrice && (
                      <span className="text-gray-500 text-sm line-through mr-2">₹{premiumPlan.originalPrice}</span>
                    )}
                    <span className="font-heading font-bold text-4xl text-primary">₹{premiumPlan.price}</span>
                    <span className="text-gray-600 text-sm ml-1">/ {premiumPlan.period}</span>
                  </div>
                  {premiumPlan.discount && (
                    <span className="inline-block mt-3 text-sm font-medium bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                      {premiumPlan.discount}
                    </span>
                  )}
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="bg-accent p-2 rounded-full">
                      <BookOpen className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium">3 new books delivered monthly</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="bg-accent p-2 rounded-full">
                      <Target className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium">Personalized book selection</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="bg-accent p-2 rounded-full">
                      <Users className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium">Dedicated book buddy</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="bg-accent p-2 rounded-full">
                      <Truck className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium">Free pickup service</span>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="bg-accent p-2 rounded-full">
                      <TrendingUp className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium">Reading progress tracking</span>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-secondary/10 transition-colors">
                    <div className="bg-secondary p-2 rounded-full">
                      <MessageSquare className="text-white h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="ml-3 font-medium text-secondary">Extended reading buddy support</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full py-6 text-lg bg-secondary hover:bg-secondary/90 transition-colors"
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending || !!user?.subscription}
                >
                  {user?.subscription 
                    ? "Already Subscribed" 
                    : subscribeMutation.isPending 
                      ? "Processing..." 
                      : "Subscribe Now"}
                </Button>
              </div>
              
              <p className="text-center text-gray-600 mt-8 font-medium">
                Join now and give your child the gift of a lifetime: the love of reading.
              </p>
              
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="font-heading font-bold text-xl text-center mb-8">Why Premium Is The Best Choice</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free tier */}
                  <div className="rounded-xl border border-secondary/10 overflow-hidden bg-secondary/5">
                    <div className="bg-secondary/10 p-4 text-center">
                      <h4 className="font-heading font-bold text-lg text-secondary">Free</h4>
                      <p className="text-sm text-gray-600 mt-1">Basic access</p>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="mr-3 text-secondary/70 mt-0.5">
                            <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Limited Book Library</p>
                            <p className="text-sm text-gray-600">Preview of select books</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 text-secondary/70 mt-0.5">
                            <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Book Reviews</p>
                            <p className="text-sm text-gray-600">Read limited reviews</p>
                          </div>
                        </li>
                        <li className="flex items-start opacity-50">
                          <div className="mr-3 mt-0.5">
                            <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Book Delivery</p>
                            <p className="text-sm text-gray-600">Not available</p>
                          </div>
                        </li>
                        <li className="flex items-start opacity-50">
                          <div className="mr-3 mt-0.5">
                            <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Reading Tracker</p>
                            <p className="text-sm text-gray-600">Not available</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Premium tier */}
                  <div className="rounded-xl border-2 border-primary shadow-lg relative md:scale-110 z-10 bg-primary/5">
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                    <div className="bg-primary p-4 text-center text-white">
                      <h4 className="font-heading font-bold text-lg">Premium</h4>
                      <p className="text-sm text-white/90 mt-1">Complete experience</p>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="mr-3 bg-accent text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Full Book Library</p>
                            <p className="text-sm text-gray-600">Access to all available books</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-accent text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Monthly Book Delivery</p>
                            <p className="text-sm text-gray-600">3 curated books every month</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-accent text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Personal Book Buddy</p>
                            <p className="text-sm text-gray-600">1-on-1 reading guidance</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-accent text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Progress Tracking</p>
                            <p className="text-sm text-gray-600">Detailed reading statistics</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-accent text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Book Reviews</p>
                            <p className="text-sm text-gray-600">Post unlimited reviews</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Premium+ tier */}
                  <div className="rounded-xl border border-secondary/10 overflow-hidden bg-secondary/5">
                    <div className="bg-secondary p-4 text-center text-white">
                      <h4 className="font-heading font-bold text-lg">Annual Plan</h4>
                      <p className="text-sm text-white/90 mt-1">Best value</p>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="mr-3 bg-secondary text-white p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">All Premium Features</p>
                            <p className="text-sm text-gray-600">Everything in Premium plan</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-secondary text-white p-1 rounded-full mt-0.5">
                            <Star className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Biggest Discount</p>
                            <p className="text-sm text-gray-600">Save up to ₹4,388 per year</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-secondary text-white p-1 rounded-full mt-0.5">
                            <Gift className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Welcome Gift</p>
                            <p className="text-sm text-gray-600">Special bookshelf or organizer</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-3 bg-secondary text-white p-1 rounded-full mt-0.5">
                            <Award className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">Premium Book Selections</p>
                            <p className="text-sm text-gray-600">Priority for new releases</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
