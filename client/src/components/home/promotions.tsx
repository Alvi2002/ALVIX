import { Button } from "@/components/ui/button";

export default function Promotions() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-header flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-5 w-5">
            <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 015.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 10-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3zM11.25 12.75H3v6.75a2.25 2.25 0 002.25 2.25h6v-9zM12.75 12.75v9h6.75a2.25 2.25 0 002.25-2.25v-6.75h-9z" />
          </svg>
          বোনাস এবং প্রমোশন
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4757] to-accent opacity-80"></div>
            <div className="relative p-6">
              <h3 className="text-xl font-bold text-white mb-2 font-header">স্বাগতম বোনাস</h3>
              <p className="text-white text-sm mb-4">নতুন সদস্যদের জন্য ১০০% বোনাস। ৫,০০০ টাকা পর্যন্ত পাবেন!</p>
              <Button className="bg-white text-secondary hover:bg-white/90">বিস্তারিত</Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80"></div>
            <div className="relative p-6">
              <h3 className="text-xl font-bold text-white mb-2 font-header">দৈনিক ক্যাশব্যাক</h3>
              <p className="text-white text-sm mb-4">প্রতিদিন আপনার লসের ১০% ফেরত পান। কোনো শর্ত নেই!</p>
              <Button className="bg-white text-secondary hover:bg-white/90">বিস্তারিত</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
