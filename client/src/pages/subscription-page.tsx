import { useMutation } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Check, Gift } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/subscribe", {
        planId: "free_premium",
        price: 0,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Activated!",
        description: "You now have access to all premium features.",
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
      
      <section className="py-12 bg-gradient-to-r from-primary to-accent text-white flex-grow">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Join BookBuddy Premium!</h2>
            <p className="max-w-2xl mx-auto">Unlock all features and get access to exclusive books and reading challenges.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-dark text-white text-center py-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-success text-white px-4 py-1 transform translate-x-8 translate-y-4 rotate-45">
                FREE!
              </div>
              <h3 className="font-heading font-bold">Premium Access</h3>
            </div>
            <div className="p-6 text-dark">
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <Gift className="w-16 h-16 text-success mx-auto mb-2" />
                  <span className="font-heading font-bold text-2xl text-primary">Free Access</span>
                  <p className="text-gray-600">Limited time offer - Get premium features at no cost!</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Unlimited access to all books in our library</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Exclusive reading challenges with rewards</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Ad-free reading experience</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Advanced reading analytics and progress tracking</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Special badges and avatars for your profile</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-success mr-2 h-5 w-5" />
                  <span>Early access to new book releases</span>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  className="bg-secondary text-white font-heading font-semibold py-3 px-8 rounded-xl hover:bg-opacity-90 transition"
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending || !!user?.subscription}
                >
                  {user?.subscription 
                    ? "Already Subscribed" 
                    : subscribeMutation.isPending 
                      ? "Processing..." 
                      : "Activate Free Access"}
                </Button>
                <p className="mt-3 text-sm text-gray-500">Enjoy all premium features with no payment required!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
