import { Book } from "@shared/schema";

interface BookCardProps {
  book: Book;
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
      <img 
        src={book.coverImage} 
        alt={`${book.title} cover`} 
        className="w-full h-48 md:h-56 object-cover"
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
      </div>
    </div>
  );
}
