import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";

interface SubscriptionRequiredProps {
  featureName: string;
  description?: string;
}

export default function SubscriptionRequired({ featureName, description }: SubscriptionRequiredProps) {
  return (
    <Card className="max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-white text-center py-6">
        <CardTitle className="flex items-center justify-center gap-2">
          <Gift className="h-6 w-6" />
          <span>Premium Feature</span>
        </CardTitle>
        <CardDescription className="text-white/80">
          {featureName} is part of our premium book club experience
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium">Full access to all books</h4>
              <p className="text-sm text-gray-500">Enjoy our entire collection of age-appropriate books delivered to your doorstep.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium">Personal reading buddy</h4>
              <p className="text-sm text-gray-500">A dedicated mentor to guide your child's reading journey.</p>
            </div>
          </div>
          {description && (
            <div className="p-4 mt-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm italic">{description}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pb-6">
        <Link href="/subscription">
          <Button className="w-full">Subscribe Now</Button>
        </Link>
        <p className="text-xs text-center text-gray-500 mt-2">
          Join our book club to unlock all premium features and foster a love for reading in your child.
        </p>
      </CardFooter>
    </Card>
  );
}