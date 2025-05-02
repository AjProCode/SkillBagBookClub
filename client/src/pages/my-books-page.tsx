import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import ReadingProgress from "@/components/ui/reading-progress";
import { Button } from "@/components/ui/button";
import SubscriptionRequired from "@/components/ui/subscription-required";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Book, UserBook } from "@shared/schema";
import { BookOpen, TrendingUp, Clock, Award, Target } from "lucide-react";

const updateProgressSchema = z.object({
  bookId: z.string(),
  progress: z.coerce.number().min(0).max(100),
});

type UpdateProgressValues = z.infer<typeof updateProgressSchema>;

export default function MyBooksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const hasSubscription = !!user?.subscription;

  const { data: readingStats, error: statsError, isLoading: statsLoading } = useQuery<{
    booksRead: number;
    readingStreak: number;
    hoursRead: number;
    readingLevel: string;
    yearlyGoal: number;
    yearlyProgress: number;
  }>({
    queryKey: ['/api/reading-stats'],
    retry: hasSubscription ? 3 : 0, // Don't retry if user doesn't have subscription
  });

  const { data: currentlyReading, error: booksError, isLoading: loadingBooks } = useQuery<UserBook[]>({
    queryKey: ['/api/my-books'],
    retry: hasSubscription ? 3 : 0, // Don't retry if user doesn't have subscription
  });

  const { data: availableBooks } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (values: UpdateProgressValues) => {
      const res = await apiRequest("PATCH", "/api/my-books/progress", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reading-stats'] });
      toast({
        title: "Progress updated",
        description: "Your reading progress has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating progress",
        description: error?.message || "An error occurred while updating your reading progress.",
        variant: "destructive",
      });
    }
  });

  const addBookMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const res = await apiRequest("POST", "/api/my-books", { bookId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-books'] });
      setDialogOpen(false);
      toast({
        title: "Book added",
        description: "The book has been added to your reading list.",
      });
    },
    onError: (error: any) => {
      // Handle subscription required error
      if (error?.message?.includes("Subscription required") || error?.code === "SUBSCRIPTION_REQUIRED") {
        toast({
          title: "Subscription required",
          description: "You need to subscribe to add books to your reading list.",
          variant: "destructive",
        });
        setDialogOpen(false);
      } else {
        toast({
          title: "Error adding book",
          description: error?.message || "An error occurred while adding the book.",
          variant: "destructive",
        });
      }
    }
  });

  const form = useForm<{ bookId: string }>({
    defaultValues: {
      bookId: "",
    },
  });

  const onSubmit = (values: { bookId: string }) => {
    addBookMutation.mutate(values.bookId);
  };

  // Check if subscription is required (based on API response errors)
  const subscriptionRequired = 
    (statsError && statsError?.message?.includes("Subscription required")) || 
    (booksError && booksError?.message?.includes("Subscription required"));

  // If user doesn't have subscription or we got subscription required errors, show subscription prompt
  if (!hasSubscription || subscriptionRequired) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <section className="py-12 bg-white flex-grow">
          <div className="container mx-auto px-4">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8">My Reading Journey</h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-primary/5 rounded-xl p-6 mb-6">
                    <h3 className="font-heading font-semibold text-xl mb-4">Subscriber Benefits</h3>
                    <ul className="space-y-4">
                      <li className="flex">
                        <BookOpen className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>Track your reading progress across all your books</span>
                      </li>
                      <li className="flex">
                        <TrendingUp className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>Build reading streaks and earn rewards</span>
                      </li>
                      <li className="flex">
                        <Clock className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>Log reading hours and improve your skills</span>
                      </li>
                      <li className="flex">
                        <Award className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>Level up your reading journey and earn badges</span>
                      </li>
                      <li className="flex">
                        <Target className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>Set and achieve reading goals with progress tracking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-heading font-semibold text-lg mb-2">Did you know?</h3>
                    <p className="text-gray-700">
                      Children who read just 20 minutes per day are exposed to approximately 1.8 million words per year and score in the 90th percentile on standardized tests.
                    </p>
                  </div>
                </div>
                
                <div>
                  <SubscriptionRequired 
                    featureName="Reading Progress Tracking" 
                    description="Subscribe to track your reading journey, earn rewards, and get physical books delivered to your doorstep every month!"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section id="my-books" className="py-12 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8">My Reading Journey</h2>

          {/* Reading Stats */}
          <div className="bg-light rounded-2xl p-4 md:p-6 shadow-md mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm mb-1">Books Read</h3>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {readingStats?.booksRead || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm mb-1">Reading Streak</h3>
                <p className="font-heading font-bold text-2xl md:text-3xl text-secondary">
                  {readingStats?.readingStreak || 0} days
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm mb-1">Hours Read</h3>
                <p className="font-heading font-bold text-2xl md:text-3xl text-accent">
                  {readingStats?.hoursRead || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm mb-1">Reading Level</h3>
                <p className="font-heading font-bold text-2xl md:text-3xl text-success">
                  {readingStats?.readingLevel || 'Beginner'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h3 className="font-heading font-semibold mb-3">Your Reading Goal</h3>
              <div className="mb-2 flex justify-between">
                <span className="text-sm">
                  {readingStats?.booksRead || 0} of {readingStats?.yearlyGoal || 20} books in 2023
                </span>
                <span className="text-sm font-semibold">
                  {readingStats ? Math.round((readingStats.booksRead / readingStats.yearlyGoal) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full" 
                  style={{ width: `${readingStats ? Math.min(100, Math.round((readingStats.booksRead / readingStats.yearlyGoal) * 100)) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Books */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-semibold text-xl">Currently Reading</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary text-white font-heading">Add New Book</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">Add a Book to Your List</DialogTitle>
                  <DialogDescription>
                    Select a book from our library to add to your reading list.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bookId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-heading">Select a Book</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a book" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableBooks?.map(book => (
                                <SelectItem key={book.id} value={book.id.toString()}>
                                  {book.title} by {book.author}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-primary"
                        disabled={addBookMutation.isPending}
                      >
                        {addBookMutation.isPending ? "Adding..." : "Add to My Books"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {loadingBooks ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : currentlyReading && currentlyReading.length > 0 ? (
            <div className="space-y-4">
              {currentlyReading.map((userBook) => (
                <ReadingProgress 
                  key={userBook.id} 
                  userBook={userBook} 
                  onUpdateProgress={(progress) => {
                    updateProgressMutation.mutate({
                      bookId: userBook.bookId.toString(),
                      progress
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-light rounded-xl p-8 text-center">
              <h3 className="font-heading font-semibold text-xl mb-4">You're not reading any books yet!</h3>
              <p className="text-gray-600 mb-6">
                Add books to your reading list to track your progress.
              </p>
              <Button 
                className="bg-secondary text-white font-heading"
                onClick={() => setDialogOpen(true)}
              >
                Add Your First Book
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
