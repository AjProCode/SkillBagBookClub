import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { SkillbagLogo } from "@/components/ui/skillbag-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  BookCopy, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu 
} from "lucide-react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center">
            <SkillbagLogo width={160} height={40} />
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center space-x-6">
            <Link 
              href="/library" 
              className={`font-heading font-medium ${isActive("/library") ? "text-primary" : "text-dark hover:text-primary"} transition`}
            >
              Library
            </Link>
            <Link 
              href="/my-books" 
              className={`font-heading font-medium ${isActive("/my-books") ? "text-primary" : "text-dark hover:text-primary"} transition`}
            >
              My Books
            </Link>
            <Link 
              href="/reviews" 
              className={`font-heading font-medium ${isActive("/reviews") ? "text-primary" : "text-dark hover:text-primary"} transition`}
            >
              Reviews
            </Link>
            <Link 
              href="/subscription" 
              className={`font-heading font-medium ${isActive("/subscription") ? "text-primary" : "text-dark hover:text-primary"} transition`}
            >
              Subscribe
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-primary text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-heading">Hi, {user.username}!</div>
                    {user.subscription && (
                      <div className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                        Premium
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-primary text-white font-heading font-semibold py-2 px-4 rounded-xl">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        )}
        
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      {isMobile && (
        <nav className={`bg-white border-t border-gray-100 ${!mobileMenuOpen ? 'hidden' : ''}`}>
          <div className="container mx-auto px-4 py-2 flex justify-between">
            <Link href="/library" className="text-center flex-1 py-2">
              <BookOpen className="mx-auto block" />
              <span className="text-xs mt-1 block">Library</span>
            </Link>
            <Link href="/my-books" className="text-center flex-1 py-2">
              <BookCopy className="mx-auto block" />
              <span className="text-xs mt-1 block">My Books</span>
            </Link>
            <Link href="/reviews" className="text-center flex-1 py-2">
              <MessageSquare className="mx-auto block" />
              <span className="text-xs mt-1 block">Reviews</span>
            </Link>
            <Link href="/subscription" className="text-center flex-1 py-2">
              <User className="mx-auto block" />
              <span className="text-xs mt-1 block">Subscribe</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
