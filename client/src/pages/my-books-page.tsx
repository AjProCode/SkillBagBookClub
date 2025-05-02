import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import ReadingProgress from "@/components/ui/reading-progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Book, UserBook } from "@shared/schema";

const updateProgressSchema = z.object({
  bookId: z.string(),
  progress: z.coerce.number().min(0).max(100),
});

type UpdateProgressValues = z.infer<typeof updateProgressSchema>;

export default function MyBooksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: readingStats } = useQuery<{
    booksRead: number;
    readingStreak: number;
    hoursRead: number;
    readingLevel: string;
    yearlyGoal: number;
    yearlyProgress: number;
  }>({
    queryKey: ['/api/reading-stats'],
  });

  const { data: currentlyReading, isLoading: loadingBooks } = useQuery<UserBook[]>({
    queryKey: ['/api/my-books'],
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
  });

  const form = useForm<{ bookId: string }>({
    defaultValues: {
      bookId: "",
    },
  });

  const onSubmit = (values: { bookId: string }) => {
    addBookMutation.mutate(values.bookId);
  };

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
