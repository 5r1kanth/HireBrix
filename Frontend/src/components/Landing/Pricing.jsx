import React from "react";
import { motion } from "framer-motion";
import { PRICING } from "../../data/Landing";

export default function Pricing() {

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, type: "spring", stiffness: 80 },
    }),
  };

  return (
    <section
      id="pricing"
      className="bg-secondary rounded-lg py-16 flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Simple Pricing</h3>
        <p className="text-gray-600 mb-12">
          Pay for what you use — flexible plans for freelancers, teams, and agencies.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.plans.map((plan, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`p-6 rounded-xl border-2 ${plan.borderClass} ${plan.bgClass} hover:shadow-xl transition-shadow`}
            >
              <div className="text-sm text-gray-500 mb-4">{plan.name}</div>
              <div className="text-3xl font-bold mb-4">
                {plan.price}{" "}
                <span className="text-sm font-medium text-gray-500">{plan.period}</span>
              </div>
              <ul className="text-gray-700 space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <button className={plan.buttonClass}>{plan.buttonText}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
