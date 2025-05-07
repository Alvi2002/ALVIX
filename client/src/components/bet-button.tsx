import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  isLive: boolean;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  statistics?: {
    possession: {
      home: number;
      away: number;
    };
    shots: {
      home: number;
      away: number;
    };
  };
  score?: {
    home: number;
    away: number;
  };
};

type BetButtonProps = {
  match: Match;
  betType: "home" | "draw" | "away";
  betName?: string;
  onBetSelect: (match: Match, betType: string) => void;
  odds?: number;
  className?: string;
  children?: React.ReactNode;
};

// ম্যাচের বেট বাটন কম্পোনেন্ট
export function BetButton({
  match,
  betType,
  betName,
  onBetSelect,
  odds,
  className = "",
  children
}: BetButtonProps) {
  // অডস না দেওয়া হলে ম্যাচ থেকে নেওয়া হবে
  const betOdds = odds || match.odds[betType];
  
  // বেট নেম তৈরি করা
  let displayName = betName;
  if (!displayName) {
    if (betType === "home") {
      displayName = match.homeTeam.split(' ')[0];
    } else if (betType === "away") {
      displayName = match.awayTeam.split(' ')[0];
    } else {
      displayName = "ড্র";
    }
  }
  
  // উচ্চ অডস কি না চেক করা
  const isHighOdds = betOdds >= 2.5;

  return (
    <Button
      variant="outline"
      className={`flex-1 justify-between border-accent/70 bg-secondary/30 hover:bg-accent hover:text-secondary transition-all ${className}`}
      onClick={() => onBetSelect(match, betType)}
    >
      {children || (
        <>
          <span className="text-foreground">{displayName}</span>
          <div className="flex items-center">
            {isHighOdds && <Sparkles className="h-3 w-3 text-yellow-400 mr-1" />}
            <span className={`${isHighOdds ? 'text-yellow-400' : 'text-accent'} font-bold`}>{betOdds}</span>
          </div>
        </>
      )}
    </Button>
  );
}

// বেট করুন বাটন কম্পোনেন্ট
export function BetNowButton({
  match,
  betType,
  onBetSelect
}: {
  match: Match;
  betType: "home" | "draw" | "away";
  onBetSelect: (match: Match, betType: string) => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-accent text-accent hover:bg-accent hover:text-background text-xs font-medium transition-all shadow-sm"
      onClick={() => onBetSelect(match, betType)}
    >
      বেট করুন
    </Button>
  );
}