import { useState } from "react";
import { Link } from "wouter";
import { Flame, Dice5, Video, Volleyball, Zap, Trophy } from "lucide-react";

const categoryTabs = [
  {
    id: "popular",
    icon: <Flame className="text-accent mr-2 h-4 w-4" />,
    text: "জনপ্রিয় গেমস",
    link: "/games/popular"
  },
  {
    id: "slots",
    icon: <Dice5 className="text-accent mr-2 h-4 w-4" />,
    text: "স্লট গেমস",
    link: "/games/slots"
  },
  {
    id: "live",
    icon: <Video className="text-accent mr-2 h-4 w-4" />,
    text: "লাইভ ক্যাসিনো",
    link: "/games/live"
  },
  {
    id: "sports",
    icon: <Volleyball className="text-accent mr-2 h-4 w-4" />,
    text: "স্পোর্টস বেটিং",
    link: "/games/sports"
  },
  {
    id: "instant",
    icon: <Zap className="text-accent mr-2 h-4 w-4" />,
    text: "ইনস্ট্যান্ট গেমস",
    link: "/games/instant"
  },
  {
    id: "tournaments",
    icon: <Trophy className="text-accent mr-2 h-4 w-4" />,
    text: "টুর্নামেন্ট",
    link: "/games/tournaments"
  }
];

export default function Categories() {
  const [activeTab, setActiveTab] = useState("popular");

  return (
    <div className="bg-card py-4">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto custom-scrollbar space-x-6 py-2">
          {categoryTabs.map((tab) => (
            <Link 
              key={tab.id} 
              href={tab.link}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
              className={`category-tab whitespace-nowrap text-white font-medium px-1 py-2 text-center transition duration-200 border-b-2 border-transparent flex items-center ${
                activeTab === tab.id ? "active" : ""
              }`}
            >
              {tab.icon}
              {tab.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
