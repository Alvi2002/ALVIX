import { Button } from "@/components/ui/button";

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

  return (
    <Button
      variant="outline"
      className={`flex-1 justify-center border-accent bg-secondary/30 hover:bg-accent hover:text-secondary ${className}`}
      onClick={() => onBetSelect(match, betType)}
    >
      {children || (
        <>
          <span className="text-white">{displayName}</span>
          <span className="text-accent ml-2">{betOdds}</span>
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
      className="border-accent text-accent hover:bg-accent hover:text-background text-xs"
      onClick={() => onBetSelect(match, betType)}
    >
      বেট করুন
    </Button>
  );
}