import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { UserBook } from "@shared/schema";

interface ReadingProgressProps {
  userBook: UserBook;
  onUpdateProgress: (progress: number) => void;
}

export default function ReadingProgress({ userBook, onUpdateProgress }: ReadingProgressProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(userBook.progress);

  const handleProgressUpdate = () => {
    onUpdateProgress(progressValue);
    setDialogOpen(false);
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
            <span>Progress</span>
            <span>{userBook.progress}%</span>
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
          <Button className="ml-4 bg-primary text-white p-2 rounded-lg">
            <i className="ri-add-line"></i>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Update Reading Progress</DialogTitle>
            <DialogDescription>
              Track how much you've read of "{userBook.book.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-2 flex justify-between">
              <span>Current progress: {progressValue}%</span>
            </div>
            <Slider
              defaultValue={[userBook.progress]}
              max={100}
              step={1}
              value={[progressValue]}
              onValueChange={(value) => setProgressValue(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleProgressUpdate} className="bg-primary">
              Update Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
