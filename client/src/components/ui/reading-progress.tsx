import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBook } from "@shared/schema";
import { BookOpen, Clock, CalendarDays, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ReadingProgressProps {
  userBook: UserBook;
  onUpdateProgress: (progress: number) => void;
}

export default function ReadingProgress({ userBook, onUpdateProgress }: ReadingProgressProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(userBook.progress);
  const [activeTab, setActiveTab] = useState("update-progress");
  
  // Assuming each book has ~300 pages on average
  const totalPages = 300;
  const pagesRead = Math.round(userBook.progress / 100 * totalPages);
  
  // New fields for reading log
  const [minutesRead, setMinutesRead] = useState<number>(15);
  const [logDate, setLogDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState<string>("");
  const [pagesRead2, setPagesRead2] = useState<number>(pagesRead);

  const handleProgressUpdate = () => {
    onUpdateProgress(progressValue);
    setDialogOpen(false);
  };
  
  const handleAddReadingLog = () => {
    // Calculate new progress percentage based on pages read
    const newProgress = Math.min(100, Math.round((pagesRead2 / totalPages) * 100));
    onUpdateProgress(newProgress);
    setProgressValue(newProgress);
    setDialogOpen(false);
    
    // In a real app, we would save the reading log entry with minutes read, date and notes
    // to a separate table in the database
  };

  return (
    <div className="bg-light rounded-xl p-4 flex items-center">
      <img 
        src={userBook.book.coverImage} 
        alt={`${userBook.book.title} cover`} 
        className="w-16 h-24 object-cover rounded-lg"
      />
      <div className="ml-4 flex-1">
        <h4 className="font-heading font-semibold">{userBook.book.title}</h4>
        <p className="text-gray-600 text-sm">{userBook.book.author}</p>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Pages read</span>
            <span>{pagesRead} of {totalPages}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${userBook.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="ml-4 bg-primary text-white" size="sm">
            Update
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading">Reading Updates</DialogTitle>
            <DialogDescription>
              Track your reading progress for "{userBook.book.title}"
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="update-progress" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="update-progress">Update Progress</TabsTrigger>
              <TabsTrigger value="reading-log">Add Reading Log</TabsTrigger>
            </TabsList>
            
            {/* Progress Tab */}
            <TabsContent value="update-progress" className="space-y-4">
              <div className="py-2">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium">Current progress: {progressValue}%</span>
                  <span className="text-sm text-gray-500">{Math.round(progressValue / 100 * totalPages)} of {totalPages} pages</span>
                </div>
                <Slider
                  defaultValue={[userBook.progress]}
                  max={100}
                  step={1}
                  value={[progressValue]}
                  onValueChange={(value) => setProgressValue(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 pages</span>
                  <span>{Math.round(totalPages/4)} pages</span>
                  <span>{Math.round(totalPages/2)} pages</span>
                  <span>{Math.round(totalPages*3/4)} pages</span>
                  <span>{totalPages} pages</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleProgressUpdate} className="bg-primary w-full">
                  Update Progress
                </Button>
              </DialogFooter>
            </TabsContent>
            
            {/* Reading Log Tab */}
            <TabsContent value="reading-log" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                      Date
                    </label>
                    <Input 
                      type="date" 
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Minutes Read
                    </label>
                    <Input 
                      type="number" 
                      min="1"
                      value={minutesRead}
                      onChange={(e) => setMinutesRead(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                    Pages Read (Current total: {pagesRead})
                  </label>
                  <Input 
                    type="number" 
                    min="0"
                    max={totalPages}
                    value={pagesRead2}
                    onChange={(e) => setPagesRead2(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                    Notes & Thoughts
                  </label>
                  <Textarea 
                    placeholder="What did you learn? What was interesting?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleAddReadingLog} className="bg-primary w-full">
                  Save Reading Log
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
