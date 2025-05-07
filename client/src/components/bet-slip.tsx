import { useState, useEffect } from "react";
import { X, Trash2, DollarSign, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BetSelection = {
  id: string;
  matchId: number;
  match: string;
  betType: string;
  betName: string;
  odds: number;
};

type BetSlip = {
  selections: BetSelection[];
  stake: number;
  potentialWin: number;
};

type BetSlipProps = {
  isOpen: boolean;
  betSlip: BetSlip;
  onClose: () => void;
  onRemoveBet: (id: string) => void;
  onStakeChange: (stake: number) => void;
  onPlaceBet: () => void;
  onClearAll: () => void;
};

export function BetSlip({
  isOpen,
  betSlip,
  onClose,
  onRemoveBet,
  onStakeChange,
  onPlaceBet,
  onClearAll
}: BetSlipProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  // বেট সিলেকশনে কোন আইটেম না থাকলে
  if (betSlip.selections.length === 0) {
    return (
      <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "bottom-4 right-4"} z-50`}>
        <Card className="border-accent border-2">
          <CardHeader className="bg-accent text-white p-3 flex flex-row justify-between items-center">
            <h3 className="font-medium text-sm">বেট স্লিপ</h3>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">বেট স্লিপ খালি আছে। বেট সিলেকশন করুন।</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // কোন বেট সিলেকশন থাকলে
  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "bottom-4 right-4"} z-50`}>
      <Card className="border-accent border-2">
        <CardHeader className="bg-accent text-white p-3 flex flex-row justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-medium text-sm">
              বেট স্লিপ ({betSlip.selections.length})
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 h-6 w-6 p-0 text-white" 
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-white" 
              onClick={onClearAll}
              title="সব মুছুন"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isCollapsed && (
          <>
            <CardContent className="p-0 max-h-[40vh] overflow-y-auto">
              {betSlip.selections.map((bet) => (
                <div
                  key={bet.id}
                  className="p-3 border-b border-border flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{bet.match}</p>
                    <p className="text-xs text-muted-foreground">{bet.betName}</p>
                  </div>
                  <div className="flex items-center ml-2">
                    <span className="text-accent font-bold text-sm mr-2">@{bet.odds}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onRemoveBet(bet.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            
            <CardFooter className="flex flex-col p-3 gap-3 bg-accent/5">
              <div className="flex items-center justify-between w-full">
                <label htmlFor="stake" className="text-sm font-medium">
                  বাজি (৳)
                </label>
                <div className="flex items-center relative">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  <Input
                    id="stake"
                    type="number"
                    className="w-24 h-8 text-right"
                    value={betSlip.stake}
                    onChange={(e) => onStakeChange(Math.max(0, Number(e.target.value)))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">সম্ভাব্য জিত:</span>
                <span className="text-accent font-bold">৳{betSlip.potentialWin.toFixed(2)}</span>
              </div>
              
              <Button
                variant="default"
                className="w-full bg-accent hover:bg-accent/90 text-white mt-2"
                onClick={onPlaceBet}
                size="lg"
              >
                বেট করুন
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export function BetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  betSlip
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  betSlip: BetSlip;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">বেট নিশ্চিত করুন</h3>
          <p className="text-sm text-muted-foreground">
            আপনি {betSlip.selections.length}টি বেট সিলেকশন করেছেন।
            আপনার বাজি ৳{betSlip.stake} এবং সম্ভাব্য জিত ৳{betSlip.potentialWin}
          </p>
        </div>
        
        <div className="max-h-[40vh] overflow-y-auto mb-4">
          {betSlip.selections.map((bet) => (
            <div
              key={bet.id}
              className="p-3 border-b border-border flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{bet.match}</p>
                <p className="text-xs text-muted-foreground">{bet.betName}</p>
              </div>
              <span className="text-accent font-bold text-sm ml-2">@{bet.odds}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            className="border-muted-foreground text-muted-foreground"
            onClick={onClose}
          >
            বাতিল করুন
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={onConfirm}
          >
            নিশ্চিত করুন
          </Button>
        </div>
      </div>
    </div>
  );
}