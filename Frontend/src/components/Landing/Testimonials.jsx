import React from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "../../data/Landing";

export default function Testimonials() {

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="bg-secondary rounded-lg py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold mb-10">What Teams Say</h3>

        {/* Reduced gap for small screens */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {TESTIMONIALS.testimonials.map((t, index) => (
            <motion.blockquote
              key={index}
              className="p-6 bg-white rounded-xl soft-card relative text-left hover:shadow-lg transition-shadow"
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Decorative quote icon */}
              <div className="absolute -top-3 -left-3 text-[2.5rem] text-gray-200 select-none">“</div>
              <p className="text-gray-700 text-base mt-2">{t.quote}</p>
              <div className="mt-4 text-sm text-gray-600">— {t.author}</div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
