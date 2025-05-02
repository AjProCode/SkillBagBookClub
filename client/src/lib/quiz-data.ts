// Define the quiz questions, answer options, and scoring logic

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  text: string;
  // Scores for different genre preferences
  scores: {
    adventure: number;
    fantasy: number;
    mystery: number;
    scifi: number;
    historical: number;
    educational: number;
  };
};

export type QuizResults = {
  adventure: number;
  fantasy: number;
  mystery: number;
  scifi: number;
  historical: number;
  educational: number;
};

// The quiz questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What kind of story do you enjoy most?",
    options: [
      {
        id: "q1-a",
        text: "Journeys to unknown places and exciting challenges",
        scores: { adventure: 5, fantasy: 3, mystery: 1, scifi: 2, historical: 1, educational: 0 }
      },
      {
        id: "q1-b",
        text: "Magical worlds with incredible creatures and powers",
        scores: { adventure: 2, fantasy: 5, mystery: 0, scifi: 3, historical: 0, educational: 0 }
      },
      {
        id: "q1-c",
        text: "Puzzles, clues, and solving unexpected problems",
        scores: { adventure: 1, fantasy: 0, mystery: 5, scifi: 1, historical: 0, educational: 2 }
      },
      {
        id: "q1-d",
        text: "Futuristic technology and space exploration",
        scores: { adventure: 2, fantasy: 1, mystery: 0, scifi: 5, historical: 0, educational: 3 }
      },
      {
        id: "q1-e",
        text: "Stories from the past that teach us about history",
        scores: { adventure: 1, fantasy: 0, mystery: 1, scifi: 0, historical: 5, educational: 4 }
      }
    ]
  },
  {
    id: "q2",
    question: "Who would be your ideal main character?",
    options: [
      {
        id: "q2-a",
        text: "A brave explorer discovering new lands",
        scores: { adventure: 5, fantasy: 2, mystery: 0, scifi: 1, historical: 2, educational: 1 }
      },
      {
        id: "q2-b",
        text: "A wizard or witch learning powerful magic",
        scores: { adventure: 1, fantasy: 5, mystery: 0, scifi: 1, historical: 0, educational: 0 }
      },
      {
        id: "q2-c",
        text: "A clever detective solving difficult cases",
        scores: { adventure: 0, fantasy: 0, mystery: 5, scifi: 1, historical: 1, educational: 2 }
      },
      {
        id: "q2-d",
        text: "An astronaut or scientist making amazing discoveries",
        scores: { adventure: 1, fantasy: 0, mystery: 1, scifi: 5, historical: 0, educational: 4 }
      },
      {
        id: "q2-e",
        text: "Someone from history experiencing important events",
        scores: { adventure: 1, fantasy: 0, mystery: 0, scifi: 0, historical: 5, educational: 3 }
      }
    ]
  },
  {
    id: "q3",
    question: "What setting would you prefer to read about?",
    options: [
      {
        id: "q3-a",
        text: "Tropical jungles, mountains, or islands waiting to be explored",
        scores: { adventure: 5, fantasy: 1, mystery: 1, scifi: 0, historical: 1, educational: 2 }
      },
      {
        id: "q3-b",
        text: "Enchanted forests, castles, or magical kingdoms",
        scores: { adventure: 2, fantasy: 5, mystery: 0, scifi: 0, historical: 0, educational: 0 }
      },
      {
        id: "q3-c",
        text: "Old mansions, foggy cities, or places with secrets",
        scores: { adventure: 0, fantasy: 1, mystery: 5, scifi: 0, historical: 2, educational: 1 }
      },
      {
        id: "q3-d",
        text: "Spaceships, distant planets, or future cities",
        scores: { adventure: 1, fantasy: 1, mystery: 0, scifi: 5, historical: 0, educational: 3 }
      },
      {
        id: "q3-e",
        text: "Ancient civilizations or important time periods from the past",
        scores: { adventure: 1, fantasy: 0, mystery: 1, scifi: 0, historical: 5, educational: 4 }
      }
    ]
  },
  {
    id: "q4",
    question: "What do you hope to get from reading a book?",
    options: [
      {
        id: "q4-a",
        text: "Excitement and thrilling moments that keep me on the edge of my seat",
        scores: { adventure: 5, fantasy: 3, mystery: 3, scifi: 2, historical: 1, educational: 0 }
      },
      {
        id: "q4-b",
        text: "A chance to imagine incredible things that could never happen in real life",
        scores: { adventure: 2, fantasy: 5, mystery: 1, scifi: 4, historical: 0, educational: 0 }
      },
      {
        id: "q4-c",
        text: "Mental challenges and surprises that make me think",
        scores: { adventure: 1, fantasy: 1, mystery: 5, scifi: 2, historical: 1, educational: 3 }
      },
      {
        id: "q4-d",
        text: "Ideas about what the future might be like and how technology might change",
        scores: { adventure: 1, fantasy: 1, mystery: 0, scifi: 5, historical: 0, educational: 3 }
      },
      {
        id: "q4-e",
        text: "Learning interesting facts while enjoying a good story",
        scores: { adventure: 1, fantasy: 0, mystery: 1, scifi: 1, historical: 4, educational: 5 }
      }
    ]
  },
  {
    id: "q5",
    question: "Which of these activities sounds most fun to you?",
    options: [
      {
        id: "q5-a",
        text: "Going hiking or camping in the wilderness",
        scores: { adventure: 5, fantasy: 1, mystery: 0, scifi: 0, historical: 1, educational: 2 }
      },
      {
        id: "q5-b",
        text: "Creating art or stories about magical creatures",
        scores: { adventure: 1, fantasy: 5, mystery: 0, scifi: 1, historical: 0, educational: 1 }
      },
      {
        id: "q5-c",
        text: "Solving puzzles or playing detective games",
        scores: { adventure: 1, fantasy: 0, mystery: 5, scifi: 1, historical: 0, educational: 2 }
      },
      {
        id: "q5-d",
        text: "Building robots or learning about space",
        scores: { adventure: 0, fantasy: 0, mystery: 0, scifi: 5, historical: 0, educational: 4 }
      },
      {
        id: "q5-e",
        text: "Visiting museums or historical sites",
        scores: { adventure: 1, fantasy: 0, mystery: 1, scifi: 0, historical: 5, educational: 4 }
      }
    ]
  }
];

// Function to calculate quiz results based on answers
export function calculateResults(answers: Record<string, string>): QuizResults {
  // Initialize scores at 0
  const results: QuizResults = {
    adventure: 0,
    fantasy: 0,
    mystery: 0,
    scifi: 0,
    historical: 0,
    educational: 0
  };

  // For each question the user answered
  Object.entries(answers).forEach(([questionId, optionId]) => {
    // Find the question
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Find the selected option
    const option = question.options.find(o => o.id === optionId);
    if (!option) return;
    
    // Add the scores from this option
    results.adventure += option.scores.adventure;
    results.fantasy += option.scores.fantasy;
    results.mystery += option.scores.mystery;
    results.scifi += option.scores.scifi;
    results.historical += option.scores.historical;
    results.educational += option.scores.educational;
  });

  return results;
}

// Get top genres based on scores
export function getTopGenres(results: QuizResults, count: number = 2): string[] {
  // Convert results to array of [genre, score] pairs
  const scores = Object.entries(results) as [keyof QuizResults, number][];
  
  // Sort by score in descending order
  scores.sort((a, b) => b[1] - a[1]);
  
  // Return top N genres
  return scores.slice(0, count).map(([genre]) => genre);
}