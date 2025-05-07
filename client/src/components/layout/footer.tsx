import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-accent/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-lg">টক999</h3>
            <p className="text-muted-foreground text-sm mb-4">
              টক999 হল বাংলাদেশের সেরা অনলাইন গেমিং প্ল্যাটফর্ম।
              নিরাপদ এবং বিশ্বাসযোগ্য গেমিং অভিজ্ঞতা পেতে আজই টক999এ যোগ দিন।
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">গেমস</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games/slots">
                  <a className="text-muted-foreground hover:text-accent transition-colors">স্লট গেমস</a>
                </Link>
              </li>
              <li>
                <Link href="/games/live-casino">
                  <a className="text-muted-foreground hover:text-accent transition-colors">লাইভ ক্যাসিনো</a>
                </Link>
              </li>
              <li>
                <Link href="/games/sports">
                  <a className="text-muted-foreground hover:text-accent transition-colors">স্পোর্টস বেটিং</a>
                </Link>
              </li>
              <li>
                <Link href="/games/card">
                  <a className="text-muted-foreground hover:text-accent transition-colors">কার্ড গেমস</a>
                </Link>
              </li>
              <li>
                <Link href="/games/arcade">
                  <a className="text-muted-foreground hover:text-accent transition-colors">আর্কেড গেমস</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">তথ্য</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-accent transition-colors">আমাদের সম্পর্কে</a>
                </Link>
              </li>
              <li>
                <Link href="/responsible-gaming">
                  <a className="text-muted-foreground hover:text-accent transition-colors">দায়িত্বশীল গেমিং</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-accent transition-colors">শর্তাবলী</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-accent transition-colors">গোপনীয়তা নীতি</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-accent transition-colors">প্রশ্নোত্তর</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">যোগাযোগ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-accent transition-colors">যোগাযোগ করুন</a>
                </Link>
              </li>
              <li>
                <Link href="/helpdesk">
                  <a className="text-muted-foreground hover:text-accent transition-colors">হেল্পডেস্ক</a>
                </Link>
              </li>
              <li>
                <Link href="/affiliate">
                  <a className="text-muted-foreground hover:text-accent transition-colors">অ্যাফিলিয়েট প্রোগ্রাম</a>
                </Link>
              </li>
              <li>
                <Link href="/payments">
                  <a className="text-muted-foreground hover:text-accent transition-colors">পেমেন্ট পদ্ধতি</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} টক999। সর্বস্বত্ব সংরক্ষিত।
          </p>
          
          <div className="flex space-x-4">
            <Link href="/responsible-gaming">
              <a className="text-xs text-muted-foreground hover:text-accent transition-colors">
                দায়িত্বশীল গেমিং
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-xs text-muted-foreground hover:text-accent transition-colors">
                শর্তাবলী
              </a>
            </Link>
            <Link href="/privacy">
              <a className="text-xs text-muted-foreground hover:text-accent transition-colors">
                গোপনীয়তা নীতি
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}