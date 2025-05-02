import { Link } from "wouter";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { SkillbagLogo } from "@/components/ui/skillbag-logo";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-accent to-secondary text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
                Develop a Lifelong Reading Habit!
              </h1>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Receive 3 carefully selected books monthly and track your reading progress with our digital tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold py-3 px-6 rounded-xl">
                  <Link href="/subscription">Subscribe Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white text-primary font-heading font-semibold py-3 px-6 rounded-xl">
                  <Link href="/library">Explore Library</Link>
                </Button>
              </div>
              <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-secondary text-white p-2 rounded-lg">
                    <i className="ri-star-fill"></i>
                  </div>
                  <p className="ml-3 font-medium">Special Offer: ₹3000 for 3 months subscription - Save ₹597!</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=500&q=80" 
                alt="Children reading books" 
                className="rounded-2xl shadow-lg max-w-full h-auto animate-bounce-soft" 
                style={{ maxHeight: "400px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl md:text-3xl mb-12">
            Everything You Need For Your Reading Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-light rounded-2xl p-6 shadow-md card-hover">
              <div className="bg-primary bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <i className="ri-book-open-line text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Digital Library</h3>
              <p className="text-gray-600 mb-4">Browse through hundreds of books organized by age and genre.</p>
              <Link href="/library" className="text-primary font-semibold flex items-center">
                Explore Books <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-light rounded-2xl p-6 shadow-md card-hover">
              <div className="bg-secondary bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <i className="ri-bookmark-line text-2xl text-secondary"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Reading Log</h3>
              <p className="text-gray-600 mb-4">Keep track of your reading progress and set goals for yourself.</p>
              <Link href="/my-books" className="text-primary font-semibold flex items-center">
                Start Tracking <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-light rounded-2xl p-6 shadow-md card-hover">
              <div className="bg-primary bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <i className="ri-chat-1-line text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Book Reviews</h3>
              <p className="text-gray-600 mb-4">Share your thoughts and read reviews from other kids your age.</p>
              <Link href="/reviews" className="text-primary font-semibold flex items-center">
                Read Reviews <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img 
                  src="/images/skillbag-logo-white.svg" 
                  alt="Skillbag Logo" 
                  className="h-10" 
                />
              </div>
              <p className="mt-3 text-white/80 max-w-xs">
                Helping young readers develop a lifelong reading habit through engaging books and digital features!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading font-semibold mb-3">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/library" className="text-white/80 hover:text-white transition">Library</Link></li>
                  <li><Link href="/reviews" className="text-white/80 hover:text-white transition">Reviews</Link></li>
                  <li><Link href="/my-books" className="text-white/80 hover:text-white transition">Reading Tracker</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold mb-3">Account</h3>
                <ul className="space-y-2">
                  <li><Link href="/auth" className="text-white/80 hover:text-white transition">Sign Up</Link></li>
                  <li><Link href="/auth" className="text-white/80 hover:text-white transition">Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold mb-3">Parents</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/80 hover:text-white transition">Safety Guidelines</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition">Privacy Controls</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">© 2025 Skillbag Book Club. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition"><i className="ri-facebook-fill text-xl"></i></a>
              <a href="#" className="text-white/80 hover:text-white transition"><i className="ri-twitter-fill text-xl"></i></a>
              <a href="#" className="text-white/80 hover:text-white transition"><i className="ri-instagram-line text-xl"></i></a>
              <a href="#" className="text-white/80 hover:text-white transition"><i className="ri-youtube-fill text-xl"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
