import { CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";

export default function PaymentMethods() {
  const paymentMethods = [
    {
      name: "বিকাশ",
      logo: (
        <div className="bg-pink-600 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <span className="text-white font-bold text-xs">b</span>
        </div>
      ),
      color: "bg-pink-600"
    },
    {
      name: "নগদ",
      logo: (
        <div className="bg-orange-600 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <span className="text-white font-bold text-xs">ন</span>
        </div>
      ),
      color: "bg-orange-600"
    },
    {
      name: "রকেট",
      logo: (
        <div className="bg-purple-700 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <span className="text-white font-bold text-xs">R</span>
        </div>
      ),
      color: "bg-purple-700"
    },
    {
      name: "উপায়",
      logo: (
        <div className="bg-blue-600 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <span className="text-white font-bold text-xs">U</span>
        </div>
      ),
      color: "bg-blue-600"
    },
    {
      name: "VISA",
      logo: (
        <div className="bg-blue-700 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <CreditCard className="h-3 w-3 text-white" />
        </div>
      ),
      color: "bg-blue-700"
    },
    {
      name: "USDT",
      logo: (
        <div className="bg-green-600 rounded-full p-1 w-6 h-6 flex justify-center items-center mr-1">
          <span className="text-white font-bold text-xs">$</span>
        </div>
      ),
      color: "bg-green-600"
    }
  ];

  return (
    <section className="mb-10">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 font-header text-center flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-5 w-5">
            <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
          </svg>
          পেমেন্ট পদ্ধতি
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded-lg w-24 h-12 flex items-center justify-center shadow-sm hover:shadow transition-all"
            >
              <div className="flex items-center">
                {method.logo}
                <span className="text-primary font-medium text-sm">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <a 
            href="/payments" 
            className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center"
          >
            সব পেমেন্ট পদ্ধতি দেখুন
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
