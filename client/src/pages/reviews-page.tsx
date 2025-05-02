import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import ReviewCard from "@/components/ui/review-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import SubscriptionRequired from "@/components/ui/subscription-required";
import { Lock } from "lucide-react";
import { UserBook, BookReview } from "@shared/schema";

const reviewSchema = z.object({
  bookId: z.string({
    required_error: "Please select a book"
  }),
  rating: z.string({
    required_error: "Please give a rating"
  }),
  review: z.string()
    .min(10, "Your review must be at least 10 characters")
    .max(500, "Your review can't be longer than 500 characters"),
  favoriteCharacter: z.string()
    .min(3, "This field must be at least 3 characters")
    .optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewsPage() {
  const [activeRating, setActiveRating] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const hasSubscription = !!user?.subscription;

  const { data: myBooks, error: myBooksError } = useQuery<UserBook[]>({
    queryKey: ['/api/my-books'],
    retry: hasSubscription ? 3 : 0, // Don't retry if user doesn't have subscription
  });

  const { data: reviews, isLoading: loadingReviews, error: reviewsError } = useQuery<BookReview[]>({
    queryKey: ['/api/reviews'],
  });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      bookId: "",
      rating: "",
      review: "",
      favoriteCharacter: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      const res = await apiRequest("POST", "/api/reviews", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      form.reset();
      setActiveRating(0);
      toast({
        title: "Review posted",
        description: "Your review has been posted successfully!",
      });
    },
    onError: (error: any) => {
      // Handle subscription required error
      if (error?.message?.includes("Subscription required") || error?.code === "SUBSCRIPTION_REQUIRED") {
        toast({
          title: "Subscription required",
          description: "You need to subscribe to post book reviews.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error posting review",
          description: error?.message || "An error occurred while posting your review.",
          variant: "destructive",
        });
      }
    }
  });

  const onSubmit = (values: ReviewFormValues) => {
    createReviewMutation.mutate(values);
  };

  const handleRatingClick = (rating: number) => {
    setActiveRating(rating);
    form.setValue("rating", rating.toString());
  };

  const completedBooks = myBooks?.filter(book => book.progress === 100) || [];
  
  // Check if previews exist in the data
  const hasPreviewReviews = reviews?.some(review => (review as any).isPreview);
  
  // Determine if we should show subscription prompt
  const showSubscriptionRequired = 
    !hasSubscription || 
    (myBooksError && myBooksError?.message?.includes("Subscription required")) ||
    hasPreviewReviews;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section id="reviews" className="py-12 bg-light flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl">Book Reviews By Kids Like You</h2>
            {!hasSubscription && (
              <div className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Preview Mode</span>
              </div>
            )}
          </div>

          <div className={showSubscriptionRequired ? "grid grid-cols-1 md:grid-cols-3 gap-8" : ""}>
            <div className={showSubscriptionRequired ? "md:col-span-2" : ""}>
              {loadingReviews ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center mb-12">
                  <h3 className="font-heading font-semibold text-xl mb-4">No reviews yet!</h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to share your thoughts about a book you've read.
                  </p>
                </div>
              )}
            </div>

            {showSubscriptionRequired && (
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <SubscriptionRequired 
                    featureName="Full reviews & writing" 
                    description="Subscribe to read all reviews, post your own, and have physical books delivered to your doorstep!"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Show review form only for subscribers */}
          {(!showSubscriptionRequired || hasSubscription) && (
            <Card className="bg-white rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="font-heading font-bold text-xl">Share Your Own Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="bookId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block font-heading font-medium">Choose a book you've read</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full p-3 border border-gray-300 rounded-xl">
                                <SelectValue placeholder="Select a book from your Reading Log" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {completedBooks.length > 0 ? (
                                completedBooks.map(book => (
                                  <SelectItem key={book.id} value={book.bookId.toString()}>
                                    {book.book.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no_books" disabled>
                                  You haven't completed any books yet
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={() => (
                        <FormItem>
                          <FormLabel className="block font-heading font-medium">Your Rating</FormLabel>
                          <div className="flex text-2xl text-gray-300">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingClick(star)}
                                className="focus:outline-none"
                              >
                                <i className={`ri-star-fill ${activeRating >= star ? 'text-yellow-400' : ''}`}></i>
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block font-heading font-medium">What did you think about this book?</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              className="w-full p-3 border border-gray-300 rounded-xl"
                              placeholder="Tell other kids what you liked or didn't like about this book..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="favoriteCharacter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block font-heading font-medium">Who was your favorite character and why?</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full p-3 border border-gray-300 rounded-xl"
                              placeholder="Share your thoughts on the characters..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-center">
                      <Button 
                        type="submit"
                        className="bg-accent text-white font-heading font-semibold py-3 px-6 rounded-xl hover:bg-opacity-90 transition"
                        disabled={createReviewMutation.isPending}
                      >
                        {createReviewMutation.isPending ? "Posting..." : "Post Your Review"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
