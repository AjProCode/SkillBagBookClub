import { format } from "date-fns";
import { BookReview } from "@shared/schema";
import { Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";

interface ReviewCardProps {
  review: BookReview & {
    isPreview?: boolean;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { user } = useAuth();
  const hasSubscription = !!user?.subscription;
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <i 
            key={star}
            className={`${star <= rating ? 'ri-star-fill' : (star - 0.5 <= rating ? 'ri-star-half-fill' : 'ri-star-line')} text-yellow-400`}
          ></i>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "PPP");
  };

  const getTimeSince = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 md:p-6 card-hover ${review.isPreview ? 'relative' : ''}`}>
      {review.isPreview && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-md z-10">
          <Lock className="h-3 w-3" />
          <span>Preview</span>
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
          {review.user.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h4 className="font-heading font-semibold">{review.user.username}</h4>
          {renderStars(review.rating)}
        </div>
      </div>
      <div className="flex mb-4">
        <img 
          src={review.book.coverImage} 
          alt={`${review.book.title} cover`} 
          className="w-16 h-24 object-cover rounded-lg"
        />
        <div className="ml-3">
          <h4 className="font-heading font-semibold">{review.book.title}</h4>
          <p className="text-gray-600 text-sm">{review.book.author}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-3">{review.review}</p>
      {review.favoriteCharacter && !review.isPreview && (
        <p className="text-gray-600 text-sm italic mb-3">
          <span className="font-semibold">Favorite character: </span>{review.favoriteCharacter}
        </p>
      )}
      
      {review.isPreview && !hasSubscription && (
        <div className="mt-3 mb-4">
          <Link href="/subscription">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Subscribe to See Full Reviews
            </Button>
          </Link>
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-500">
        <span title={formatDate(review.createdAt)}>
          Posted {getTimeSince(review.createdAt)}
        </span>
        <div className="flex items-center">
          <button className="flex items-center mr-3" disabled={review.isPreview}>
            <i className="ri-thumb-up-line mr-1"></i> {review.likes}
          </button>
          <button className="flex items-center" disabled={review.isPreview}>
            <i className="ri-chat-1-line mr-1"></i> {review.comments}
          </button>
        </div>
      </div>
    </div>
  );
}
