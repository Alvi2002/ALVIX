import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type BetNowFooterProps = {
  match?: any; 
  onViewDetails?: () => void;
  onBetNow: () => void;
};

export function BetNowFooter({ match, onViewDetails, onBetNow }: BetNowFooterProps) {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-accent hover:text-accent/80"
        onClick={onViewDetails}
      >
        বিস্তারিত দেখুন
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        className="bg-accent hover:bg-accent/90 text-white"
        onClick={onBetNow}
      >
        বেট করুন
      </Button>
    </div>
  );
}