import { Book } from "@shared/schema";
import { Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./button";

interface BookCardProps {
  book: Book & {
    isPreview?: boolean;
    previewDescription?: string;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const getAgeRangeColorClass = (ageRange: string) => {
    switch(ageRange) {
      case "8-10":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "11-13":
        return "bg-accent bg-opacity-10 text-accent";
      case "14-16":
        return "bg-primary bg-opacity-10 text-primary";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden card-hover ${book.isPreview ? 'relative' : ''}`}>
      {book.isPreview && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-md z-10">
          <Lock className="h-3 w-3" />
          <span>Preview</span>
        </div>
      )}
      
      <img 
        src={book.coverImage} 
        alt={`${book.title} cover`} 
        className={`w-full h-48 md:h-56 object-cover ${book.isPreview ? 'opacity-80' : ''}`}
      />
      <div className="p-3 md:p-4">
        <div className="flex items-center mb-2">
          <span className={`${getAgeRangeColorClass(book.ageRange)} text-xs px-2 py-1 rounded-lg`}>
            Ages {book.ageRange}
          </span>
          <div className="ml-auto flex items-center">
            <i className="ri-star-fill text-yellow-400 text-sm"></i>
            <span className="text-sm ml-1">{book.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-sm md:text-base truncate">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm">
          {book.author}
        </p>
        
        {book.isPreview && book.previewDescription && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 line-clamp-3">
              {book.previewDescription}
            </p>
            <div className="mt-3">
              <Link href="/subscription">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Subscribe for Full Access
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
