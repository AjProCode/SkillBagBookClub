import { Link } from "wouter";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { SkillbagLogo } from "@/components/ui/skillbag-logo";
import { BookOpen, Bookmark, Star, Clock, Book, ChevronRight, Award, BarChart, BookMarked } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { UserBook } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: userBooks } = useQuery<UserBook[]>({
    queryKey: ["/api/my-books"],
    enabled: !!user,
  });
  
  const { data: readingStats } = useQuery({
    queryKey: ["/api/reading-stats"],
    enabled: !!user,
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-secondary/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 text-secondary">
                Develop a Lifelong Reading Habit!
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-700">
                Receive 3 carefully selected books monthly and track your reading progress with our digital tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold py-3 px-6 rounded-xl">
                  <Link href="/subscription">Subscribe Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-secondary text-secondary hover:bg-secondary/5 font-heading font-semibold py-3 px-6 rounded-xl">
                  <Link href="/library">Explore Library</Link>
                </Button>
              </div>
              <div className="mt-6 bg-accent/5 rounded-xl p-4 border border-accent/20">
                <div className="flex items-center">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <p className="ml-3 font-medium text-gray-700">Special Offer: ₹3000 for 3 months subscription</p>
                </div>
              </div>
              <div className="mt-4 italic text-gray-600 border-l-4 border-primary/40 pl-4 py-2">
                "A reader lives a thousand lives before he dies. The man who never reads lives only one." 
                <span className="block text-sm mt-1">- George R.R. Martin</span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src="https://images.unsplash.com/photo-1569307371632-50356e4356f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80" 
                alt="Teenagers reading books" 
                className="rounded-2xl shadow-lg max-w-full h-auto" 
                style={{ maxHeight: "400px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Current Reading Section (Only for logged in users with books) */}
      {user && userBooks && userBooks.length > 0 && (
        <section className="py-12 bg-secondary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-heading font-bold text-2xl md:text-3xl mb-8">
              Your Reading Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Stats */}
              <div className="md:col-span-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Reading Stats
                    </CardTitle>
                    <CardDescription>Your reading progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Books Read</span>
                        </div>
                        <span className="font-semibold text-lg">
                          {readingStats?.booksRead || 0}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Hours Read</span>
                        </div>
                        <span className="font-semibold text-lg">
                          {readingStats?.hoursRead || 0}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Reading Level</span>
                        </div>
                        <span className="font-semibold text-lg">
                          {readingStats?.readingLevel || "Beginner"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/my-books">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Current Books */}
              <div className="md:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5 text-primary" />
                      Current Reading List
                    </CardTitle>
                    <CardDescription>Books you're currently reading</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userBooks.slice(0, 3).map((userBook) => (
                        <div key={userBook.id} className="flex items-center p-3 border rounded-lg">
                          <div className="flex-shrink-0 mr-4 h-16 w-12 bg-secondary/10 rounded flex items-center justify-center">
                            <Book className="h-8 w-8 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate">
                              {userBook.book.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              by {userBook.book.author}
                            </p>
                            <div className="flex justify-between mt-1 text-xs text-gray-600">
                              <span>Pages read:</span>
                              <span className="font-medium">{Math.round(userBook.progress * 3)} of 300</span>
                            </div>
                            <div className="mt-1 bg-gray-200 h-2 rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${userBook.progress}%` }}
                              />
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                            <Link href="/my-books">
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="default" className="w-full">
                      <Link href="/my-books">Update Progress</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl md:text-3xl mb-12">
            Everything You Need For Your Reading Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-secondary/5 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-secondary/10">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Digital Library</h3>
              <p className="text-gray-600 mb-4">Browse through hundreds of books organized by age and genre.</p>
              <Link href="/library" className="text-primary font-semibold flex items-center">
                Explore Books <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-secondary/5 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-secondary/10">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Bookmark className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Reading Log</h3>
              <p className="text-gray-600 mb-4">Keep track of your reading progress and set goals for yourself.</p>
              <Link href="/my-books" className="text-accent font-semibold flex items-center">
                Start Tracking <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-secondary/5 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-secondary/10">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Book Reviews</h3>
              <p className="text-gray-600 mb-4">Share your thoughts and read reviews from other kids your age.</p>
              <Link href="/reviews" className="text-secondary font-semibold flex items-center">
                Read Reviews <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/5 py-8 mt-auto border-t border-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <SkillbagLogo width={180} height={40} isWhite={false} />
              </div>
              <p className="mt-3 text-gray-600 max-w-xs">
                Helping young readers develop a lifelong reading habit through engaging books and digital features!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading font-semibold mb-3 text-secondary">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/library" className="text-gray-600 hover:text-secondary transition">Library</Link></li>
                  <li><Link href="/reviews" className="text-gray-600 hover:text-secondary transition">Reviews</Link></li>
                  <li><Link href="/my-books" className="text-gray-600 hover:text-secondary transition">Reading Tracker</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold mb-3 text-secondary">Account</h3>
                <ul className="space-y-2">
                  <li><Link href="/auth" className="text-gray-600 hover:text-secondary transition">Sign Up</Link></li>
                  <li><Link href="/auth" className="text-gray-600 hover:text-secondary transition">Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold mb-3 text-secondary">Parents</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-secondary transition">Safety Guidelines</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-secondary transition">Privacy Controls</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Skillbag Book Club. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-secondary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 19c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm-5-5.5c0-.276.224-.5.5-.5h9c.276 0 .5.224.5.5s-.224.5-.5.5h-9c-.276 0-.5-.224-.5-.5zm0-4c0-.276.224-.5.5-.5h9c.276 0 .5.224.5.5s-.224.5-.5.5h-9c-.276 0-.5-.224-.5-.5zm0-4c0-.276.224-.5.5-.5h9c.276 0 .5.224.5.5s-.224.5-.5.5h-9c-.276 0-.5-.224-.5-.5z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-secondary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-5-9h10v2H7v-2z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-secondary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-5-8h4V8h2v4h4v2h-4v4h-2v-4H7v-2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
