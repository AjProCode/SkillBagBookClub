import { useState, useEffect } from "react";
import { quizQuestions, calculateResults, QuizResults as QuizResultsType } from "@/lib/quiz-data";
import { QuizQuestion } from "@/components/ui/quiz-question";
import { QuizResults } from "@/components/ui/quiz-results";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Book } from "@shared/schema";

export default function QuizPage() {
  // State to track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State to track user's answers (questionId -> optionId)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // State to track if quiz is complete
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // State to store quiz results
  const [results, setResults] = useState<QuizResultsType | null>(null);

  // Fetch all books from the database
  const { data: books, isLoading: isBooksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
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
      // Quiz completed
      const quizResults = calculateResults(answers);
      setResults(quizResults);
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
  };

  // Find recommended books based on quiz results
  const getRecommendedBooks = (): Book[] => {
    if (!results || !books || books.length === 0) return [];

    // Convert results to array of [genre, score] pairs and sort by score
    const genreScores = Object.entries(results) as [string, number][];
    genreScores.sort((a, b) => b[1] - a[1]);

    // Get top genres
    const topGenres = genreScores.slice(0, 2).map(([genre]) => genre);

    // Find books that match top genres
    // For this example, we'll simply look for books with genre properties
    // In a real app, you would have a more sophisticated matching algorithm
    return books.filter(book => {
      // Check if book matches any top genre
      // This is just a simple example - replace with your actual book properties
      return topGenres.some(genre => 
        book.genre?.toLowerCase().includes(genre.toLowerCase()) || 
        book.description?.toLowerCase().includes(genre.toLowerCase())
      );
    }).slice(0, 4); // Limit to 4 recommendations
  };

  if (isBooksLoading) {
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
          <QuizResults 
            results={results} 
            recommendedBooks={getRecommendedBooks()}
            onStartOver={handleStartOver} 
          />
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