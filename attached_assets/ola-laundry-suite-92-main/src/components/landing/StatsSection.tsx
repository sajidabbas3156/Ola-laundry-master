
export function StatsSection() {
  const stats = [
    { number: "10,000+", label: "Active Businesses" },
    { number: "2M+", label: "Orders Processed" },
    { number: "40%", label: "Average Profit Increase" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
          <p className="text-xl opacity-90">See the impact Ola makes on businesses like yours</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
