import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizResults as QuizResultsType, getTopGenres } from "@/lib/quiz-data";
import { Link } from "wouter";
import { RefreshCw, BookOpen } from "lucide-react";
import BookCard from "@/components/ui/book-card";
import { Book } from "@shared/schema";

interface QuizResultsProps {
  results: QuizResultsType;
  recommendedBooks: Book[];
  onStartOver: () => void;
  message?: string;
}

export function QuizResults({ results, recommendedBooks, onStartOver, message }: QuizResultsProps) {
  // Calculate top genres
  const topGenres = getTopGenres(results, 2);
  
  // Find the maximum score to normalize progress bars
  const maxScore = Math.max(...Object.values(results));
  
  // Format genre name for display
  const formatGenre = (genre: string): string => {
    return genre.charAt(0).toUpperCase() + genre.slice(1);
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Your Reading Preferences</CardTitle>
          <CardDescription>
            Based on your answers, here are your reading preferences and recommended books.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Your Top Genre Preferences</h3>
            
            <div className="space-y-3">
              {Object.entries(results).map(([genre, score]) => (
                <div key={genre} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{formatGenre(genre)}</span>
                    <span className="text-sm text-muted-foreground">{Math.round((score / maxScore) * 100)}%</span>
                  </div>
                  <Progress value={(score / maxScore) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Your Book Recommendations</h3>
            
            {message && (
              <p className="text-sm text-muted-foreground mb-4">{message}</p>
            )}
            
            {recommendedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {recommendedBooks.slice(0, 4).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">We couldn't find books matching your preferences right now.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onStartOver}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Take Quiz Again
          </Button>
          <Button asChild>
            <Link href="/library">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Library
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}