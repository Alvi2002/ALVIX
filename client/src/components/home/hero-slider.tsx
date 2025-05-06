import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "সাপ্তাহিক ইস্পোর্টস টুর্নামেন্ট",
    description: "৫০,০০০ টাকা পুরস্কার জিতুন আমাদের ইস্পোর্টস চ্যাম্পিয়নশিপে",
    buttonText: "এখনই যোগ দিন",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    altText: "ইস্পোর্টস টুর্নামেন্ট"
  },
  {
    id: 2,
    title: "প্রিমিয়াম লাইভ ক্যাসিনো",
    description: "আসল ডিলারদের সাথে খেলুন আমাদের প্রিমিয়াম লাইভ ক্যাসিনোতে",
    buttonText: "খেলুন এখনই",
    image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    altText: "লাইভ ক্যাসিনো"
  },
  {
    id: 3,
    title: "জনপ্রিয় স্লট গেমস",
    description: "আমাদের সর্বাধিক জনপ্রিয় স্লট গেমগুলিতে আপনার ভাগ্য পরীক্ষা করুন",
    buttonText: "স্পিন করুন",
    image: "https://pixabay.com/get/gfaad3b4854a54eac1f9c9b14709c7583b48d10ac2e90184c6abfb647e6ad7221703cbd41ec9d84763aa2654ce4ea08859dd53a6b893a139e0232896b983200f8_1280.jpg",
    altText: "স্লট গেমস"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-card">
      <div 
        className="flex transition-transform duration-500 h-[180px] md:h-[300px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full relative">
            <img 
              src={slide.image} 
              alt={slide.altText} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent flex items-center">
              <div className="px-8 w-full md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-header">{slide.title}</h2>
                <p className="text-sm md:text-base text-foreground mt-2 mb-4">{slide.description}</p>
                <Button className="bg-accent text-secondary hover:bg-accent/90">{slide.buttonText}</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slider Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? "bg-accent" 
                : "bg-white opacity-50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Prev/Next Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full h-8 w-8 p-0 hover:bg-black/75"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full h-8 w-8 p-0 hover:bg-black/75"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
