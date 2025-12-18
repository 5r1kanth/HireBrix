import { motion } from "framer-motion";
import { FEATURES } from "../../data/Landing"; // adjust path if needed

export default function Features() {
  const gradients = [
    "from-white to-gray-100",
    "from-white to-gray-200",
    "from-white to-gray-100",
    "from-white to-gray-200",
  ];

  return (
    <section
      id="features"
      className="bg-secondary rounded-lg py-16 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-almost-black">
            Everything you need to run the consultant lifecycle
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            From candidate intake and submissions to interviews and reporting —
            built for teams that want clarity and efficiency.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={feature.title}
                className={`
                  group rounded-xl soft-card bg-gradient-to-br ${gradient}
                  cursor-pointer transition-transform duration-300
                  p-4 sm:p-5 h-[135px] sm:h-[140px]
                  hover:shadow-lg hover:scale-105
                `}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                    {feature.title}
                  </h3>

                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 
                      transition-transform duration-300 
                      group-hover:scale-110 group-hover:rotate-6 
                      ${feature.color}`}
                  />
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-snug">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
