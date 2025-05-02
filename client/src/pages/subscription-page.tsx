import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Check, BookOpen, Truck, Users, Target, MessageSquare, TrendingUp, Package } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("quarterly");

  const plans: Record<PlanType, Plan> = {
    monthly: {
      id: "monthly_plan",
      name: "Monthly",
      price: 1199,
      period: "month",
    },
    quarterly: {
      id: "quarterly_plan",
      name: "3 Months",
      price: 3000,
      originalPrice: 3597,
      period: "3 months",
      recommended: true,
      discount: "SAVE ₹597",
    },
    biannual: {
      id: "biannual_plan",
      name: "6 Months",
      price: 5500,
      originalPrice: 7194,
      period: "6 months",
      discount: "SAVE ₹1694",
    },
    annual: {
      id: "annual_plan",
      name: "Annual",
      price: 10000,
      originalPrice: 14388,
      period: "year",
      discount: "SAVE ₹4388",
    },
  };

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const plan = plans[selectedPlan];
      const res = await apiRequest("POST", "/api/subscribe", {
        planId: plan.id,
        price: plan.price,
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
      
      <section className="py-12 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Develop a Love for Reading in Your Child</h2>
            <p className="max-w-3xl mx-auto text-lg">
              Join our Book Club for ages 7 and above, where we make reading fun, engaging, and rewarding!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-xl font-bold mb-6">Here's how it works:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Personalized Book Selection</h4>
                    <p className="text-white/80">Our experts carefully select books tailored to your child's interests and reading level.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Convenient Delivery</h4>
                    <p className="text-white/80">Every month, 3 exciting books will be delivered right to your doorstep.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Flexible Reading Schedule</h4>
                    <p className="text-white/80">Your child will have ample time to enjoy and complete the books before we schedule a hassle-free pickup.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Interactive Book Buddy</h4>
                    <p className="text-white/80">Regular interactions with a dedicated book buddy to keep your child motivated.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-xl font-bold mb-6">Benefits for your child:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Goal Setting</h4>
                    <p className="text-white/80">We help set achievable reading targets to encourage steady progress.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Engaging Book Discussions</h4>
                    <p className="text-white/80">After finishing each book, your child will participate in lively discussions to deepen their understanding.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Progressive Reading Levels</h4>
                    <p className="text-white/80">We gradually increase the complexity of books to match your child's growing reading skills.</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/20 rounded-lg">
                  <p className="text-sm italic">
                    Studies show that a child begins to enjoy reading in about 3 months, and a solid reading habit forms between 6 to 9 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-dark text-white text-center py-4">
              <h3 className="font-heading font-bold text-xl">Choose Your Subscription Plan</h3>
            </div>
            
            <div className="p-8">
              <Tabs defaultValue="quarterly" onValueChange={(value) => setSelectedPlan(value as PlanType)}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">3 Months</TabsTrigger>
                  <TabsTrigger value="biannual">6 Months</TabsTrigger>
                  <TabsTrigger value="annual">Annual</TabsTrigger>
                </TabsList>
                
                {Object.entries(plans).map(([key, plan]) => (
                  <TabsContent key={key} value={key} className="mt-0">
                    <div className="bg-gray-50 rounded-xl p-6 relative">
                      {plan.recommended && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                          RECOMMENDED
                        </div>
                      )}
                      
                      <div className="text-center mb-6">
                        <h4 className="font-heading font-bold text-xl text-gray-800">{plan.name} Plan</h4>
                        <div className="mt-3">
                          {plan.originalPrice && (
                            <span className="text-gray-500 text-sm line-through mr-2">₹{plan.originalPrice}</span>
                          )}
                          <span className="font-heading font-bold text-3xl text-primary">₹{plan.price}</span>
                          <span className="text-gray-600 text-sm ml-1">/ {plan.period}</span>
                        </div>
                        {plan.discount && (
                          <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {plan.discount}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <Check className="text-success mr-2 h-5 w-5 flex-shrink-0" />
                          <span>3 new books delivered monthly</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-success mr-2 h-5 w-5 flex-shrink-0" />
                          <span>Personalized book selection</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-success mr-2 h-5 w-5 flex-shrink-0" />
                          <span>Dedicated book buddy</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-success mr-2 h-5 w-5 flex-shrink-0" />
                          <span>Free pickup service</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-success mr-2 h-5 w-5 flex-shrink-0" />
                          <span>Reading progress tracking</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary/90"
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
                  </TabsContent>
                ))}
              </Tabs>
              
              <p className="text-center text-gray-500 mt-6">
                Join now and give your child the gift of a lifetime: the love of reading.
              </p>
              
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="font-heading font-bold text-xl text-center mb-8">Premium Features Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left">Feature</th>
                        <th className="px-4 py-3 text-center">Free</th>
                        <th className="px-4 py-3 text-center bg-primary/5">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Browse Book Library</td>
                        <td className="px-4 py-3 text-center">Limited Preview</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Full Access</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Book Delivery</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">3 Books Monthly</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Reading Progress Tracking</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Unlimited</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Reading Statistics</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Detailed</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Book Reviews</td>
                        <td className="px-4 py-3 text-center">Limited Preview</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Full Access</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Post Book Reviews</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Unlimited</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Personal Book Buddy</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Included</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">Reading Goals</td>
                        <td className="px-4 py-3 text-center">—</td>
                        <td className="px-4 py-3 text-center bg-primary/5">Personalized</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
