import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  HelpCircle, 
  CreditCard, 
  Shield, 
  Users, 
  Gamepad2, 
  PhoneCall 
} from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // FAQ ডেটা
  const faqData = {
    account: [
      {
        id: "acc-1",
        question: "কিভাবে ALVIX এ অ্যাকাউন্ট খুলবেন?",
        answer: "ALVIX এ অ্যাকাউন্ট খোলা খুবই সহজ। হোমপেজে 'রেজিস্ট্রেশন' বাটনে ক্লিক করুন, ফর্মটি পূরণ করুন (ইউজারনেম, ইমেইল, পাসওয়ার্ড), আমাদের শর্তাবলী মেনে নিন, এবং 'রেজিস্টার' এ ক্লিক করুন। আপনার ইমেইল যাচাই করুন এবং আপনার অ্যাকাউন্ট ব্যবহারের জন্য প্রস্তুত।"
      },
      {
        id: "acc-2",
        question: "আমি আমার পাসওয়ার্ড ভুলে গেছি, কি করব?",
        answer: "চিন্তা করবেন না, আমরা আপনাকে সাহায্য করতে পারি। লগইন পেজে 'পাসওয়ার্ড ভুলে গেছেন?' অপশনে ক্লিক করুন, আপনার ইমেইল ঠিকানা দিন, এবং আমরা আপনাকে পাসওয়ার্ড রিসেট লিংক পাঠাব। লিংকে ক্লিক করুন এবং নতুন পাসওয়ার্ড সেট করুন।"
      },
      {
        id: "acc-3",
        question: "কিভাবে আমার ব্যক্তিগত তথ্য আপডেট করব?",
        answer: "আপনার অ্যাকাউন্টে লগইন করার পর, 'প্রোফাইল' পৃষ্ঠায় যান। সেখানে আপনি আপনার ব্যক্তিগত তথ্য দেখতে এবং সম্পাদনা করতে পারবেন। আপনার পরিবর্তনগুলি করুন এবং 'আপডেট প্রোফাইল' বাটনে ক্লিক করুন তথ্য সংরক্ষণ করতে।"
      },
      {
        id: "acc-4",
        question: "কিভাবে আমার অ্যাকাউন্ট যাচাই করব?",
        answer: "আপনার প্রোফাইল সম্পূর্ণ করার পর, 'যাচাইকরণ' ট্যাবে যান এবং প্রয়োজনীয় KYC নথি আপলোড করুন। এর মধ্যে থাকবে আপনার পরিচয়পত্রের ছবি (NID, পাসপোর্ট বা ড্রাইভিং লাইসেন্স) এবং ঠিকানার প্রমাণ। যাচাইকরণের জন্য ২৪-৪৮ ঘন্টা সময় লাগতে পারে।"
      },
      {
        id: "acc-5",
        question: "কতটি অ্যাকাউন্ট খুলতে পারি?",
        answer: "প্রতি ব্যক্তিকে শুধুমাত্র একটি অ্যাকাউন্ট থাকতে অনুমতি দেওয়া হয়। একাধিক অ্যাকাউন্ট আমাদের শর্তাবলীর বিরুদ্ধে এবং এটি আপনার অ্যাকাউন্ট বন্ধ হওয়ার কারণ হতে পারে। একটি সংস্থা, পরিবার বা ঠিকানা থেকে একাধিক অ্যাকাউন্ট পাওয়া গেলে সেগুলোও আমাদের সিস্টেমে ফ্ল্যাগ করা হবে।"
      },
      {
        id: "acc-6",
        question: "আমি কিভাবে আমার অ্যাকাউন্ট বন্ধ করতে পারি?",
        answer: "আপনার অ্যাকাউন্ট বন্ধ করতে, প্রোফাইল সেটিংসে যান এবং 'অ্যাকাউন্ট বন্ধ করুন' অপশনে ক্লিক করুন। আমরা আপনাকে বন্ধের কারণ জিজ্ঞাসা করব এবং নিশ্চিতকরণ চাইব। দয়া করে মনে রাখবেন যে অ্যাকাউন্ট বন্ধ করার আগে আপনার সমস্ত অর্থ উত্তোলন করুন।"
      }
    ],
    payments: [
      {
        id: "pay-1",
        question: "কি কি পেমেন্ট পদ্ধতি গ্রহণ করা হয়?",
        answer: "আমরা বিভিন্ন পেমেন্ট পদ্ধতি গ্রহণ করি, যার মধ্যে রয়েছে মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট), ব্যাংক ট্রান্সফার, ক্রেডিট/ডেবিট কার্ড, এবং ক্রিপ্টোকারেন্সি (বিটকয়েন, ইথেরিয়াম, USDT)। প্রতিটি পদ্ধতির সেটআপ, ফি, এবং প্রসেসিং টাইম ভিন্ন হতে পারে।"
      },
      {
        id: "pay-2",
        question: "ন্যূনতম এবং সর্বোচ্চ ডিপোজিট কত?",
        answer: "ন্যূনতম ডিপোজিট নির্ভর করে আপনার পেমেন্ট পদ্ধতির উপর। মোবাইল ব্যাংকিং এর জন্য ৫০০ টাকা, ব্যাংক ট্রান্সফার এবং কার্ড পেমেন্ট এর জন্য ১০০০ টাকা, এবং ক্রিপ্টোকারেন্সি এর জন্য ১০০০ টাকা সমতুল্য। সর্বোচ্চ ডিপোজিট সীমা পেমেন্ট পদ্ধতি এবং আপনার অ্যাকাউন্ট স্তরের উপর নির্ভর করে।"
      },
      {
        id: "pay-3",
        question: "ন্যূনতম এবং সর্বোচ্চ উত্তোলন কত?",
        answer: "ন্যূনতম উত্তোলন মোবাইল ব্যাংকিং এর জন্য ৫০০ টাকা, ব্যাংক ট্রান্সফার এর জন্য ১০০০ টাকা, এবং ক্রিপ্টোকারেন্সি এর জন্য ২০০০ টাকা সমতুল্য। সর্বোচ্চ উত্তোলন সীমা আপনার অ্যাকাউন্ট স্তর এবং যাচাইকরণ স্ট্যাটাসের উপর নির্ভর করে। ভেরিফাইড অ্যাকাউন্টের জন্য সর্বোচ্চ উত্তোলন সীমা আরও বেশি। বিস্তারিত জানতে পেমেন্ট পৃষ্ঠা দেখুন।"
      },
      {
        id: "pay-4",
        question: "উত্তোলন প্রক্রিয়া করতে কতক্ষণ সময় লাগে?",
        answer: "উত্তোলন প্রক্রিয়া করতে সময় নির্ভর করে আপনার বেছে নেওয়া পদ্ধতির উপর। মোবাইল ব্যাংকিং উত্তোলন সাধারণত ১-২৪ ঘন্টার মধ্যে প্রক্রিয়া করা হয়, ব্যাংক ট্রান্সফার ১-৩ কার্যদিবস, এবং ক্রিপ্টোকারেন্সি উত্তোলন ১-২৪ ঘন্টা সময় নিতে পারে। প্রক্রিয়াকরণের সময় জটিল যাচাইকরণ বা উচ্চ মূল্যের উত্তোলনের জন্য বাড়তে পারে।"
      },
      {
        id: "pay-5",
        question: "পেমেন্টে কি কোন ফি আছে?",
        answer: "ডিপোজিট সাধারণত ফ্রি, তবে কিছু ক্ষেত্রে আপনার পেমেন্ট প্রোভাইডার ফি চার্জ করতে পারে। উত্তোলনে বিভিন্ন ফি রয়েছে: মোবাইল ব্যাংকিং এ ১.৫%, ব্যাংক ট্রান্সফারে ০.৫%, এবং ক্রিপ্টোকারেন্সিতে ১%। এছাড়াও, ক্রিপ্টো উত্তোলনের ক্ষেত্রে নেটওয়ার্ক ফি আলাদা হিসাবে চার্জ হতে পারে। সম্পূর্ণ ফি স্ট্রাকচার জানতে পেমেন্ট পৃষ্ঠা দেখুন।"
      },
      {
        id: "pay-6",
        question: "ডিপোজিট বা উত্তোলন সমস্যার ক্ষেত্রে কি করব?",
        answer: "ডিপোজিট বা উত্তোলন সমস্যার ক্ষেত্রে, অনুগ্রহ করে আমাদের 24/7 লাইভ চ্যাট সাপোর্ট বা payments@alvix.com এ যোগাযোগ করুন। আমাদের দক্ষ কাস্টমার সাপোর্ট টিম সাহায্য করবে। যোগাযোগ করার সময়, অনুগ্রহ করে ট্রানজেকশন আইডি, পেমেন্ট পদ্ধতি, পরিমাণ, এবং সমস্যার বিবরণ প্রদান করুন।"
      }
    ],
    games: [
      {
        id: "game-1",
        question: "কি ধরনের গেমস আপনারা অফার করেন?",
        answer: "TK999 এ আমরা বিস্তৃত পরিসরের গেমিং অপশন অফার করি। এর মধ্যে রয়েছে ১০০০+ স্লট গেমস (ক্লাসিক স্লট, ভিডিও স্লট, জ্যাকপট স্লট), লাইভ কেসিনো গেমস (রুলেট, ব্ল্যাকজ্যাক, বাকারাত, পোকার), স্পোর্টস বেটিং (ফুটবল, ক্রিকেট, বাস্কেটবল, টেনিস), এবং বিশেষ গেমস যেমন ক্র্যাশ গেমস এবং লটারি।"
      },
      {
        id: "game-2",
        question: "গেমগুলো কি মোবাইলে খেলা যাবে?",
        answer: "হ্যাঁ, TK999 সম্পূর্ণভাবে মোবাইল-ফ্রেন্ডলি। আমাদের সমস্ত গেম মোবাইল-অপ্টিমাইজড, যা আপনাকে আপনার স্মার্টফোন বা ট্যাবলেট থেকে যেকোন জায়গায় খেলতে দেয়। শুধু আপনার ব্রাউজারে আমাদের ওয়েবসাইট ভিজিট করুন এবং অ্যাপ ইনস্টল করা ছাড়াই খেলা শুরু করুন।"
      },
      {
        id: "game-3",
        question: "গেমগুলোর RTP (Return to Player) কত?",
        answer: "আমাদের গেমগুলোর RTP গেম ধরন অনুসারে ভিন্ন হয়। স্লট গেমগুলোর গড় RTP ৯৬% থেকে ৯৮% এর মধ্যে। টেবিল গেমগুলো সাধারণত উচ্চতর RTP অফার করে, যেমন ব্ল্যাকজ্যাক (৯৯.৫% পর্যন্ত) এবং ব্যাকারাত (৯৮.৯% পর্যন্ত)। প্রতিটি গেমের নির্দিষ্ট RTP গেম পৃষ্ঠায় উল্লেখ করা আছে।"
      },
      {
        id: "game-4",
        question: "আমি কি বিনামূল্যে গেম খেলতে পারি?",
        answer: "হ্যাঁ, আমাদের অনেক স্লট গেম ডেমো বা ফ্রি প্লে মোডে খেলা যাবে, যা আপনাকে বাস্তব অর্থ ব্যবহার না করেই গেম খেলার অনুমতি দেয়। এটি নতুন গেম শেখার এবং গেমপ্লে পরিচিত হওয়ার জন্য দুর্দান্ত। তবে, লাইভ কেসিনো গেম এবং স্পোর্টস বেটিং এর জন্য বাস্তব অর্থ ব্যবহার প্রয়োজন।"
      },
      {
        id: "game-5",
        question: "জয় করার সর্বোচ্চ পরিমাণ কত?",
        answer: "সর্বোচ্চ পুরস্কার পরিমাণ ভিন্ন হতে পারে, গেম ধরন এবং আপনার বাজির পরিমাণের উপর নির্ভর করে। আমাদের প্রোগ্রেসিভ জ্যাকপট স্লটগুলো লাখ বা কোটি টাকার পুরস্কার অফার করতে পারে। প্রতিটি গেমের নির্দিষ্ট সর্বোচ্চ জয় সীমা গেম নিয়ম বা পৃষ্ঠায় উল্লেখ করা আছে।"
      },
      {
        id: "game-6",
        question: "আমি কিভাবে জানব যে গেমগুলো ন্যায্য?",
        answer: "ALVIX কেবল বিশ্বস্ত এবং লাইসেন্সযুক্ত গেম প্রোভাইডারদের কাছ থেকে গেম অফার করে। সমস্ত গেম রেগুলার অডিট পাস করে এবং র্যান্ডম নাম্বার জেনারেটর (RNG) ব্যবহার করে ন্যায্যতা নিশ্চিত করে। এই RNG সিস্টেমগুলো স্বাধীন তৃতীয় পক্ষের সংস্থা দ্বারা নিয়মিত পরীক্ষা করা হয় গেমগুলোর ফলাফল সম্পূর্ণ র্যান্ডম এবং ন্যায্য নিশ্চিত করতে।"
      }
    ],
    bonus: [
      {
        id: "bonus-1",
        question: "কি ধরনের বোনাস এবং প্রমোশন আপনারা অফার করেন?",
        answer: "আমরা বিভিন্ন ধরনের বোনাস এবং প্রমোশন অফার করি। এর মধ্যে রয়েছে স্বাগতম বোনাস (প্রথম জমার উপর ১০০% পর্যন্ত), ফ্রি স্পিন, রিলোড বোনাস, ক্যাশব্যাক অফার, রেফারেল বোনাস, টুর্নামেন্ট, এবং লয়্যালটি রিওয়ার্ড। আমাদের 'প্রমোশন' পৃষ্ঠা দেখুন বর্তমান অফারগুলোর বিস্তারিত জানতে।"
      },
      {
        id: "bonus-2",
        question: "কিভাবে স্বাগতম বোনাস পাবেন?",
        answer: "স্বাগতম বোনাস পেতে, প্রথমে একটি অ্যাকাউন্ট খুলুন, তারপর আপনার প্রথম ডিপোজিট করার সময় 'স্বাগতম বোনাস' অপশন সিলেক্ট করুন। ন্যূনতম ৫০০ টাকা জমা করুন বোনাস পাওয়ার জন্য। আপনার প্রথম জমার ১০০% পর্যন্ত বোনাস পাবেন, সর্বোচ্চ ১০,০০০ টাকা। একবার বোনাস ক্রেডিট করার পর, বোনাস উত্তোলনযোগ্য হওয়ার আগে ওয়েজারিং প্রয়োজনীয়তা পূরণ করতে হবে।"
      },
      {
        id: "bonus-3",
        question: "ওয়েজারিং প্রয়োজনীয়তা বলতে কি বোঝায়?",
        answer: "ওয়েজারিং প্রয়োজনীয়তা হল কতবার আপনাকে একটি বোনাস পরিমাণ বাজি ধরতে হবে এটি উত্তোলনযোগ্য হওয়ার আগে। উদাহরণস্বরূপ, আমাদের স্বাগতম বোনাসের ওয়েজারিং প্রয়োজনীয়তা ২০x। যদি আপনি ১,০০০ টাকা বোনাস পান, তাহলে আপনাকে ২০ x ১,০০০ = ২০,০০০ টাকার বাজি ধরতে হবে বোনাস উত্তোলন করার আগে। বিভিন্ন ধরনের গেম বিভিন্ন হারে ওয়েজারিং প্রয়োজনীয়তায় অবদান রাখে।"
      },
      {
        id: "bonus-4",
        question: "ফ্রি স্পিন কিভাবে কাজ করে?",
        answer: "ফ্রি স্পিন হল নির্দিষ্ট স্লট গেমে বিনামূল্যে স্পিন। এগুলো প্রমোশন হিসাবে, ডিপোজিট বোনাসের অংশ হিসাবে, বা লয়্যালটি রিওয়ার্ড হিসাবে দেওয়া হতে পারে। ফ্রি স্পিন থেকে প্রাপ্ত জয় সাধারণত বোনাস ক্যাশ হিসাবে ক্রেডিট করা হয় এবং এটি উত্তোলনযোগ্য হওয়ার আগে ওয়েজারিং প্রয়োজনীয়তা পূরণ করতে হবে। ফ্রি স্পিন সাধারণত প্রদানের তারিখ থেকে ৭ দিনের জন্য বৈধ থাকে।"
      },
      {
        id: "bonus-5",
        question: "রেফারেল বোনাস কিভাবে পাবেন?",
        answer: "বন্ধুদের রেফার করুন এবং তারা সাইন আপ এবং ডিপোজিট করলে আপনি রেফারেল বোনাস পাবেন। আপনার অ্যাকাউন্টে লগইন করুন, 'রেফার এ ফ্রেন্ড' পৃষ্ঠায় যান, এবং আপনার ইউনিক রেফারেল লিংক বা কোড শেয়ার করুন। যখন আপনার বন্ধু এই লিংক বা কোড ব্যবহার করে সাইন আপ করবে এবং ন্যূনতম ৫০০ টাকা ডিপোজিট করবে, আপনি তাদের প্রথম ডিপোজিটের ১০% রেফারেল বোনাস পাবেন।"
      },
      {
        id: "bonus-6",
        question: "কিভাবে VIP বোনাস পাবেন?",
        answer: "আমাদের VIP প্রোগ্রাম বেশি খেলার জন্য রিওয়ার্ড দেয়। আপনি যত বেশি খেলবেন, তত বেশি লয়্যালটি পয়েন্ট অর্জন করবেন। এই পয়েন্টগুলো আপনাকে VIP টিয়ারের মাধ্যমে উন্নীত করে (ব্রোঞ্জ, সিলভার, গোল্ড, প্ল্যাটিনাম, ডায়মন্ড)। উচ্চতর VIP লেভেলে বিশেষ বোনাস, দ্রুত উত্তোলন, কাস্টম প্রমোশন, ব্যক্তিগত অ্যাকাউন্ট ম্যানেজার, এবং আরও অনেক কিছু পাবেন।"
      }
    ],
    security: [
      {
        id: "sec-1",
        question: "ALVIX কিভাবে আমার ব্যক্তিগত তথ্য সুরক্ষিত রাখে?",
        answer: "আমরা আপনার ব্যক্তিগত তথ্য রক্ষার জন্য শিল্প-মানের সুরক্ষা ব্যবস্থা ব্যবহার করি। এর মধ্যে রয়েছে 256-বিট SSL এনক্রিপশন, ফায়ারওয়াল সুরক্ষা, নিয়মিত সিকিউরিটি অডিট, এবং PCI DSS সম্মতি। আমরা আপনার ডেটা সুরক্ষিত রাখার জন্য এবং এটি অননুমোদিত অ্যাক্সেস থেকে রক্ষা করার জন্য কঠোর ডেটা সংরক্ষণ নীতি অনুসরণ করি।"
      },
      {
        id: "sec-2",
        question: "দায়িত্বশীল গেমিং টুলগুলো কি কি?",
        answer: "আমরা বেশ কয়েকটি দায়িত্বশীল গেমিং টুল অফার করি। এর মধ্যে রয়েছে ডিপোজিট লিমিট (দৈনিক, সাপ্তাহিক, বা মাসিক), সময় লিমিট, স্ব-এক্সক্লুশন অপশন (নির্দিষ্ট সময়ের জন্য আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ করা), এবং আত্ম-মূল্যায়ন টেস্ট। এই টুলগুলো 'দায়িত্বশীল গেমিং' সেকশনে আপনার অ্যাকাউন্ট সেটিংসে পাওয়া যাবে।"
      },
      {
        id: "sec-3",
        question: "দ্বি-ফ্যাক্টর অথেনটিকেশন (2FA) কিভাবে সেট করবেন?",
        answer: "2FA সেট করতে, আপনার অ্যাকাউন্টে লগইন করুন, 'সিকিউরিটি সেটিংস' এ যান, এবং '2FA সক্রিয় করুন' অপশনে ক্লিক করুন। আপনি SMS, ইমেইল, বা অথেনটিকেটর অ্যাপ ভিত্তিক 2FA বেছে নিতে পারেন। অপশন বেছে নেওয়ার পর, দেওয়া নির্দেশাবলী অনুসরণ করুন। 2FA সক্রিয় হলে, প্রতিবার লগইন করার সময় আপনাকে একটি অতিরিক্ত যাচাইকরণ কোড দিতে হবে।"
      },
      {
        id: "sec-4",
        question: "কেন KYC যাচাইকরণ প্রয়োজন?",
        answer: "KYC (Know Your Customer) যাচাইকরণ দুটি মূল কারণে প্রয়োজন: প্রথমত, এটি জালিয়াতি এবং অর্থ পাচার প্রতিরোধ করতে সাহায্য করে। দ্বিতীয়ত, এটি ব্যবহারকারীদের বয়স যাচাই করে নিশ্চিত করে যে শুধুমাত্র ১৮+ ব্যক্তিরা আমাদের প্ল্যাটফর্মে গেমিং করতে পারেন। KYC পূরণ করা আপনার অ্যাকাউন্টের সুরক্ষা বাড়ায় এবং উচ্চতর উত্তোলন সীমা পাওয়ার অনুমতি দেয়।"
      },
      {
        id: "sec-5",
        question: "সন্দেহজনক লেনদেন রিপোর্ট করব কিভাবে?",
        answer: "আপনি যদি সন্দেহজনক লেনদেন বা অননুমোদিত অ্যাকাউন্ট অ্যাক্টিভিটি দেখেন, অবিলম্বে আমাদের সাথে security@alvix.com এ যোগাযোগ করুন বা 24/7 লাইভ চ্যাট সাপোর্টে যোগাযোগ করুন। অন্তর্ভুক্ত করুন যথাসম্ভব বিস্তারিত তথ্য, যেমন সন্দেহজনক লেনদেন আইডি, তারিখ, সময়, এবং ঘটনার বিবরণ। আমাদের সিকিউরিটি টিম অবিলম্বে বিষয়টি অনুসন্ধান করবে।"
      },
      {
        id: "sec-6",
        question: "সাইবার সিকিউরিটি বেস্ট প্র্যাকটিস কি কি?",
        answer: "আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে: শক্তিশালী, অনন্য পাসওয়ার্ড ব্যবহার করুন এবং এটি অন্য সাইটের সাথে শেয়ার করবেন না; 2FA সক্রিয় করুন; অফিসিয়াল TK999 URL এ ভিজিট করছেন তা নিশ্চিত করুন; পাবলিক ওয়াই-ফাই ব্যবহার করার সময় VPN ব্যবহার করুন; সন্দেহজনক ইমেইল বা লিংক থেকে সতর্ক থাকুন; নিয়মিত আপনার অ্যাকাউন্ট অ্যাক্টিভিটি পর্যবেক্ষণ করুন; এবং আপনার ডিভাইস আপডেটেড রাখুন।"
      }
    ],
    support: [
      {
        id: "supp-1",
        question: "কিভাবে কাস্টমার সাপোর্টের সাথে যোগাযোগ করবেন?",
        answer: "আমাদের সাথে যোগাযোগ করার বিভিন্ন উপায় আছে: 24/7 লাইভ চ্যাট (ওয়েবসাইটের নীচে ডান কোণে আইকন), ইমেইল (support@tk999.com), ফোন (০১৭০০-০০০০০০), বা আমাদের 'যোগাযোগ' ফর্ম ব্যবহার করুন। আমাদের সাপোর্ট টিম সাহায্য করার জন্য সবসময় উপলব্ধ, দিনে ২৪ ঘন্টা, সপ্তাহে ৭ দিন।"
      },
      {
        id: "supp-2",
        question: "রিস্পন্স টাইম কত?",
        answer: "আমরা দ্রুত রিস্পন্স অফার করি। লাইভ চ্যাট সাধারণত তাৎক্ষণিক সাপোর্ট দেয় (১-৫ মিনিট অপেক্ষা সময়)। ইমেইল জিজ্ঞাসাগুলো ২৪ ঘন্টার মধ্যে উত্তর দেওয়া হয়, তবে জটিল সমস্যার জন্য ৪৮ ঘন্টা পর্যন্ত সময় লাগতে পারে। ফোন সাপোর্ট স্থানীয় সময় সকাল ৯টা থেকে রাত ১০টা পর্যন্ত উপলব্ধ।"
      },
      {
        id: "supp-3",
        question: "TK999 কি ভাষায় সাপোর্ট প্রদান করে?",
        answer: "আমরা বর্তমানে বেশ কয়েকটি ভাষায় সাপোর্ট প্রদান করি। আমাদের মূল সাপোর্ট ভাষা হল বাংলা এবং ইংরেজি, যেখানে 24/7 সাপোর্ট উপলব্ধ। কিছু সীমিত সাপোর্ট অন্যান্য ভাষাতেও পাওয়া যাবে যেমন হিন্দি।"
      },
      {
        id: "supp-4",
        question: "সাধারণ সমস্যাগুলোর জন্য হেল্প আর্টিকেল আছে কি?",
        answer: "হ্যাঁ, আমাদের বিস্তৃত হেল্প সেন্টার আছে সাধারণ সমস্যা, প্রশ্ন, এবং ওয়াকথ্রুর টিউটোরিয়ালসহ। 'হেল্প' সেকশনে যান এবং বিভিন্ন বিষয়ে প্রবন্ধগুলো ব্রাউজ করুন যেমন অ্যাকাউন্ট সেটআপ, পেমেন্ট, গেমপ্লে, টেকনিক্যাল ইস্যু, এবং দায়িত্বশীল গেমিং। আপনি সার্চ ফাংশন ব্যবহার করে নির্দিষ্ট টপিক খুঁজতে পারেন।"
      },
      {
        id: "supp-5",
        question: "অভিযোগ দায়ের করব কিভাবে?",
        answer: "অভিযোগ দায়ের করতে, আমাদের ওয়েবসাইটের 'যোগাযোগ' পৃষ্ঠায় যান এবং ফর্মে 'অভিযোগ' বিষয় সিলেক্ট করুন, অথবা complaints@tk999.com এ ইমেইল করুন। যথাসম্ভব বিস্তারিত তথ্য প্রদান করুন, যেমন সংশ্লিষ্ট ট্রানজেকশন আইডি, অ্যাকাউন্ট বিবরণ, এবং সমস্যার পূর্ণ বিবরণ। সমস্ত অভিযোগ ৪৮ ঘন্টার মধ্যে সম্বোধন করা হবে। জটিল সমস্যার জন্য, আমাদের অভিযোগ টিম ফিডব্যাক প্রদান করবে।"
      },
      {
        id: "supp-6",
        question: "মন্তব্য এবং সাজেশন দেব কিভাবে?",
        answer: "আমরা সর্বদা আমাদের সেবা উন্নত করতে মন্তব্য এবং সাজেশন স্বাগত জানাই। আমাদের 'ফিডব্যাক' ফর্ম পূরণ করুন, যা আমাদের হোমপেজের নীচে বা কাস্টমার সাপোর্ট সেকশনে পাওয়া যাবে। অথবা, আপনি feedback@tk999.com এ ইমেইল করতে পারেন। আপনার ফিডব্যাক আমাদের টিম পর্যালোচনা করবে, এবং আমরা প্রায়শই ব্যবহারকারীদের প্রস্তাবগুলো বাস্তবায়ন করি।"
      }
    ]
  };

  // ফিল্টার ফাংশন
  const filterFAQs = (faqs: any[]) => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // সমস্ত FAQs একত্র করা সার্চের জন্য
  const allFAQs = [
    ...faqData.account,
    ...faqData.payments,
    ...faqData.games,
    ...faqData.bonus,
    ...faqData.security,
    ...faqData.support
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">সাধারণ প্রশ্নোত্তর</h1>
          <p className="text-muted-foreground">
            আমাদের সাধারণ প্রশ্নোত্তর সেকশনে আপনার প্রশ্নের উত্তর খুঁজুন
          </p>
        </div>
        
        {/* সার্চ বার */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="আপনার প্রশ্ন খুঁজুন..."
            className="pl-10 py-6 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* ট্যাব/ক্যাটাগরি সিস্টেম */}
        {searchQuery ? (
          // সার্চ রেজাল্ট
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>সার্চ রেজাল্ট: "{searchQuery}"</CardTitle>
              <CardDescription>
                {filterFAQs(allFAQs).length} টি রেজাল্ট পাওয়া গেছে
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs(allFAQs).map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filterFAQs(allFAQs).length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">কোন রেজাল্ট পাওয়া যায়নি</p>
                  <p className="text-sm text-muted-foreground mt-2">অন্য কিওয়ার্ড দিয়ে আবার চেষ্টা করুন অথবা নীচের ক্যাটাগরি দেখুন</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // ট্যাব সিস্টেম
          <Tabs defaultValue="account" className="mb-8">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="account" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                অ্যাকাউন্ট
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                পেমেন্ট
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                গেমস
              </TabsTrigger>
              <TabsTrigger value="bonus" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                বোনাস
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                সিকিউরিটি
              </TabsTrigger>
              <TabsTrigger value="support" className="data-[state=active]:bg-accent data-[state=active]:text-secondary">
                সাপোর্ট
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    অ্যাকাউন্ট সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    রেজিস্ট্রেশন, লগইন, এবং অ্যাকাউন্ট পরিচালনা সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.account.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    পেমেন্ট সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    ডিপোজিট, উত্তোলন, এবং পেমেন্ট পদ্ধতি সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.payments.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="games">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-accent" />
                    গেমস সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    আমাদের গেমস, গেমপ্লে, এবং জয়ের সম্ভাবনা সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.games.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bonus">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    বোনাস এবং প্রমোশন সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    বোনাস, প্রমোশন, এবং রিওয়ার্ড সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.bonus.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    সিকিউরিটি সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    অ্যাকাউন্ট সিকিউরিটি, ডেটা প্রোটেকশন, এবং নিরাপদ গেমিং সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.security.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-accent" />
                    সাপোর্ট সংক্রান্ত প্রশ্ন
                  </CardTitle>
                  <CardDescription>
                    কাস্টমার সাপোর্ট, যোগাযোগ, এবং সহায়তা সম্পর্কিত সাধারণ প্রশ্ন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.support.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {/* অতিরিক্ত সাহায্য সেকশন */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">এখনও সাহায্য প্রয়োজন?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-accent/20">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <PhoneCall className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>লাইভ চ্যাট</CardTitle>
                <CardDescription>24/7 রিয়েল-টাইম সাহায্য</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  আমাদের সমর্থন টিমের সাথে সরাসরি চ্যাট করুন। আমরা সবসময় সাহায্য করতে অপেক্ষা করছি।
                </p>
                <Button variant="accent" className="w-full">
                  চ্যাট শুরু করুন
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <HelpCircle className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>হেল্প সেন্টার</CardTitle>
                <CardDescription>বিস্তারিত গাইড এবং টিউটোরিয়াল</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  আমাদের বিস্তৃত ডকুমেন্টেশন, গাইড, এবং সমস্যা সমাধানের টিপস অন্বেষণ করুন।
                </p>
                <Button variant="accent" className="w-full">
                  হেল্প সেন্টার দেখুন
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <CreditCard className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>ইমেইল সাপোর্ট</CardTitle>
                <CardDescription>২৪ ঘন্টার মধ্যে উত্তর</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  আপনার প্রশ্ন বা উদ্বেগ ইমেইল করুন এবং আমাদের সমর্থন দল শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                </p>
                <Button variant="accent" className="w-full">
                  ইমেইল পাঠান
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}