import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelected: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
}

export function QuizQuestion({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelected,
  onNext,
  onPrevious,
  canGoBack,
  isLastQuestion
}: QuizQuestionProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedAnswer) {
      setErrorMessage("Please select an answer before continuing");
      return;
    }
    
    setErrorMessage(null);
    onNext();
  };

  const handleOptionSelect = (optionId: string) => {
    onAnswerSelected(question.id, optionId);
    setErrorMessage(null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {currentQuestion}/{totalQuestions}</CardTitle>
        </div>
        <CardDescription className="text-lg font-medium mt-2">
          {question.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={handleOptionSelect}
          value={selectedAnswer || undefined}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-secondary/30 transition-colors">
              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
              <Label htmlFor={option.id} className="flex-grow cursor-pointer font-normal">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          {isLastQuestion ? "See Results" : "Next"}
          {!isLastQuestion && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}