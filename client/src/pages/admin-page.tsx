import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, BookReview, User, UserBook } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User as UserIcon, Package, Star, Calendar, Clock } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("books");

  // Only allow admins to access this page
  // In a real app, you would have a proper admin role
  // For demo purposes, we're allowing the first user to be admin
  const isAdmin = user?.id === 1;

  const { data: books, isLoading: booksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    enabled: !!user && isAdmin,
  });

  const { data: userBooks, isLoading: userBooksLoading } = useQuery<UserBook[]>({
    queryKey: ["/api/all-user-books"],
    enabled: !!user && isAdmin,
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user && isAdmin,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<BookReview[]>({
    queryKey: ["/api/reviews"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Please login to access this page.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/auth">Login</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>
                You do not have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/">Go to Homepage</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 font-heading">Admin Dashboard</h1>
        
        <Tabs defaultValue="books" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Books
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="user-books" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Reading Lists
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" /> Reviews
            </TabsTrigger>
          </TabsList>
          
          {/* Books Tab */}
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Books Management
                </CardTitle>
                <CardDescription>
                  Manage all books in the library
                </CardDescription>
              </CardHeader>
              <CardContent>
                {booksLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <p>Loading books...</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of all books in the library</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cover</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Age Range</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books?.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>{book.id}</TableCell>
                          <TableCell>
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.ageRange}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{book.genre}</Badge>
                          </TableCell>
                          <TableCell>
                            {book.rating ? `${book.rating}/5` : "No ratings"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Add New Book</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" /> Users Management
                </CardTitle>
                <CardDescription>
                  Manage all users of the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of all registered users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.age || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <Badge className="bg-primary">Active</Badge>
                            ) : (
                              <Badge variant="outline">None</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Books Tab */}
          <TabsContent value="user-books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" /> Reading Lists
                </CardTitle>
                <CardDescription>
                  Track all reading activity across users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userBooksLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <p>Loading reading lists...</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Reading lists of all users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userBooks?.map((userBook) => (
                        <TableRow key={userBook.id}>
                          <TableCell>{allUsers?.find(u => u.id === userBook.userId)?.username || userBook.userId}</TableCell>
                          <TableCell className="font-medium">{userBook.book.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${userBook.progress}%` }}
                                />
                              </div>
                              <span className="text-xs">{userBook.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(userBook.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(userBook.lastUpdated).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {userBook.progress === 100 ? (
                              <Badge className="bg-green-500">Completed</Badge>
                            ) : userBook.progress > 0 ? (
                              <Badge className="bg-amber-500">In Progress</Badge>
                            ) : (
                              <Badge variant="outline">Not Started</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" /> Book Reviews
                </CardTitle>
                <CardDescription>
                  Manage all book reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <p>Loading reviews...</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Book reviews from all users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>{review.user.username}</TableCell>
                          <TableCell className="font-medium">{review.book.title}</TableCell>
                          <TableCell>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {review.review}
                          </TableCell>
                          <TableCell>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}