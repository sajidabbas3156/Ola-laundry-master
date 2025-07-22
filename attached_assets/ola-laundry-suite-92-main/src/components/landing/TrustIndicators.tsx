
export function TrustIndicators() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-6">
        <p className="text-center text-gray-500 mb-8">Trusted by leading laundry businesses worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {["CleanCorp", "LaundryMax", "FreshWash", "QuickClean", "SoapSuds"].map((company) => (
            <div key={company} className="text-xl font-bold text-gray-400">{company}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
