import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import BookCard from "@/components/ui/book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";

type AgeRange = "all" | "8-10" | "11-13" | "14-16";
type Genre = "all" | "adventure" | "fantasy" | "mystery" | "scifi";

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>("all");
  const [selectedGenre, setSelectedGenre] = useState<Genre>("all");

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgeRange = selectedAgeRange === "all" || book.ageRange === selectedAgeRange;
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    
    return matchesSearch && matchesAgeRange && matchesGenre;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section id="library" className="py-12 bg-light flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl">Discover New Books</h2>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Input
                  type="text"
                  placeholder="Search for books..."
                  className="py-2 px-4 w-48 md:w-64 outline-none border-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="bg-primary text-white p-2 px-4 rounded-none">
                  <i className="ri-search-line"></i>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto py-2 mb-6 gap-4">
            <Button 
              variant={selectedAgeRange === "all" && selectedGenre === "all" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => {
                setSelectedAgeRange("all");
                setSelectedGenre("all");
              }}
            >
              All Books
            </Button>
            <Button 
              variant={selectedAgeRange === "8-10" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedAgeRange("8-10")}
            >
              Ages 8-10
            </Button>
            <Button 
              variant={selectedAgeRange === "11-13" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedAgeRange("11-13")}
            >
              Ages 11-13
            </Button>
            <Button 
              variant={selectedAgeRange === "14-16" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedAgeRange("14-16")}
            >
              Ages 14-16
            </Button>
            <Button 
              variant={selectedGenre === "adventure" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedGenre("adventure")}
            >
              Adventure
            </Button>
            <Button 
              variant={selectedGenre === "fantasy" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedGenre("fantasy")}
            >
              Fantasy
            </Button>
            <Button 
              variant={selectedGenre === "mystery" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedGenre("mystery")}
            >
              Mystery
            </Button>
            <Button 
              variant={selectedGenre === "scifi" ? "default" : "outline"}
              className="whitespace-nowrap font-heading px-4 py-2 rounded-xl"
              onClick={() => setSelectedGenre("scifi")}
            >
              Science Fiction
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredBooks && filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="font-heading font-semibold text-xl">No books found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </div>
          )}

          {filteredBooks && filteredBooks.length > 10 && (
            <div className="mt-8 text-center">
              <Button variant="outline" className="border border-primary text-primary font-heading font-semibold py-2 px-6 rounded-xl hover:bg-primary hover:text-white transition">
                Load More Books
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
