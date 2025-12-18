import React from 'react';
import { motion } from 'framer-motion';
import { KEEPTRACK } from '../../data/Landing';

export default function Keeptrack() {

  return (
    <section className="hero-gradient rounded-lg min-h-[50vh] flex flex-col justify-center py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* Left Content */}
          <motion.div
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">
              Keep track of everything
            </h4>
            <p className="text-gray-600 mb-4">
              Automatic activity logs, audit trails, and timely reminders ensure nothing slips through the cracks.
            </p>
            <a href="#features" className="text-purple-600 font-medium hover:underline transition">
              Learn how it works →
            </a>
          </motion.div>

          {/* Right Card */}
          <motion.div
            className="md:w-1/2 w-full"  // Updated here
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {KEEPTRACK.stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 bg-white rounded-xl flex flex-col items-start justify-center hover:bg-purple-50 transition-colors duration-300 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <div className="text-sm text-gray-500">{stat.label}</div>
                    <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
