import { Link } from "wouter";
import { Dice5, UserIcon, Volleyball, Spade, Gamepad2, Trophy } from "lucide-react";

const categories = [
  {
    id: "slots",
    icon: <Dice5 className="text-accent text-xl group-hover:text-accent" />,
    title: "স্লট গেমস",
    link: "/games/slots"
  },
  {
    id: "live-casino",
    icon: <UserIcon className="text-accent text-xl group-hover:text-accent" />,
    title: "লাইভ ক্যাসিনো",
    link: "/games/live-casino"
  },
  {
    id: "sports",
    icon: <Volleyball className="text-accent text-xl group-hover:text-accent" />,
    title: "স্পোর্টস",
    link: "/games/sports"
  },
  {
    id: "card-games",
    icon: <Spade className="text-accent text-xl group-hover:text-accent" />,
    title: "কার্ড গেমস",
    link: "/games/card"
  },
  {
    id: "arcade",
    icon: <Gamepad2 className="text-accent text-xl group-hover:text-accent" />,
    title: "আর্কেড গেমস",
    link: "/games/arcade"
  },
  {
    id: "tournaments",
    icon: <Trophy className="text-accent text-xl group-hover:text-accent" />,
    title: "টুর্নামেন্ট",
    link: "/games/tournaments"
  }
];

export default function GameCategories() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-header flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-5 w-5">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
          </svg>
          গেম ক্যাটাগরি
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="bg-card rounded-lg p-4 text-center transition duration-200 hover:bg-accent group"
          >
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white">
              {category.icon}
            </div>
            <h3 className="text-white font-medium text-sm group-hover:text-secondary">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
