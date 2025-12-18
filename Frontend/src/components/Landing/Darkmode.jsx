import React from 'react';
import { motion } from 'framer-motion';
import { DARKMODE } from '../../data/Landing';

export default function Darkmode() {
  const bulletVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="bg-dark-only text-white rounded-lg min-h-screen flex flex-col justify-center py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Tailor your experience — Light & Dark
            </h3>
            <p className="text-gray-300 mb-8 max-w-lg">
              Customize fields, permission levels, and UX for clients and internal teams. 
              Toggle dark mode for late-night work.
            </p>

            <motion.ul
              className="space-y-3 text-gray-300"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {DARKMODE.changes.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-300 cursor-pointer"
                  variants={bulletVariants}
                >
                  <span className="text-pink-400 mt-1">•</span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Mock Card */}
          <motion.div
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4 text-sm text-gray-400 font-medium">Settings · Job Board</div>

            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>

              <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-300 font-medium">Job board preview</div>
                <div className="h-28 bg-gray-700 rounded mt-3 animate-pulse"></div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
