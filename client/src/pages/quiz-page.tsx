import { useState } from "react";
import { quizQuestions, calculateResults, QuizResults as QuizResultsType, getTopGenres } from "@/lib/quiz-data";
import { QuizQuestion } from "@/components/ui/quiz-question";
import { QuizResults } from "@/components/ui/quiz-results";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Book } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type RecommendationResponse = {
  recommendations: Book[];
  isPreview?: boolean;
  message: string;
};

export default function QuizPage() {
  // State to track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State to track user's answers (questionId -> optionId)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // State to track if quiz is complete
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // State to store quiz results
  const [results, setResults] = useState<QuizResultsType | null>(null);
  
  // State to store selected genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Fetch all books from the database (fallback if API fails)
  const { data: books } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  // Create a mutation for fetching recommendations
  const recommendationsMutation = useMutation({
    mutationFn: async (genres: string[]) => {
      const res = await apiRequest("POST", "/api/book-recommendations", { genres });
      return res.json() as Promise<RecommendationResponse>;
    }
  });

  // Current question
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Handle when user selects an answer
  const handleAnswerSelected = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed - calculate results
      const quizResults = calculateResults(answers);
      setResults(quizResults);
      
      // Get top genres and request recommendations from the API
      const topGenres = getTopGenres(quizResults, 2);
      setSelectedGenres(topGenres);
      
      // Call the API to get book recommendations based on these genres
      recommendationsMutation.mutate(topGenres);
      
      // Mark quiz as completed
      setQuizCompleted(true);
    }
  };
  
  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Start over
  const handleStartOver = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setResults(null);
    setSelectedGenres([]);
    recommendationsMutation.reset();
  };

  // Get recommended books - either from API response or fallback to client-side filtering
  const getRecommendedBooks = (): Book[] => {
    // First priority: use the API response if available
    if (recommendationsMutation.data?.recommendations) {
      return recommendationsMutation.data.recommendations;
    }
    
    // Second priority: client-side filtering if API failed
    if (results && books && books.length > 0 && selectedGenres.length > 0) {
      // Find books that match top genres
      return books.filter(book => {
        return selectedGenres.some(genre => 
          (book.genre && book.genre.toLowerCase().includes(genre.toLowerCase())) ||
          (book.description && book.description.toLowerCase().includes(genre.toLowerCase()))
        );
      }).slice(0, 4); // Limit to 4 recommendations
    }
    
    // Fallback: return empty array if no data available
    return [];
  };

  // Show loading state while initially loading questions
  if (!currentQuestion) {
    return (
      <div className="container max-w-6xl py-12 flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Book Recommendation Quiz</h1>
        <p className="text-muted-foreground">
          Answer a few questions to discover books tailored to your interests!
        </p>
      </div>

      <div className="flex justify-center">
        {quizCompleted && results ? (
          recommendationsMutation.isPending ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-lg">Finding your perfect book matches...</p>
              <p className="text-sm text-muted-foreground mt-2">
                We're analyzing your preferences to find the best books for you.
              </p>
            </div>
          ) : (
            <QuizResults 
              results={results} 
              recommendedBooks={getRecommendedBooks()}
              onStartOver={handleStartOver}
              message={recommendationsMutation.data?.message}
            />
          )
        ) : (
          <QuizQuestion
            question={currentQuestion}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            selectedAnswer={answers[currentQuestion.id] || null}
            onAnswerSelected={handleAnswerSelected}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoBack={currentQuestionIndex > 0}
            isLastQuestion={currentQuestionIndex === quizQuestions.length - 1}
          />
        )}
      </div>
    </div>
  );
}