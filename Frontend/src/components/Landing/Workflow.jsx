import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { WORKFLOW } from '../../data/Landing';

export default function Workflow() {
  

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section
      id="workflows"
      className="hero-gradient rounded-lg min-h-screen flex flex-col justify-center py-16"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <motion.h3
            className="text-3xl sm:text-4xl font-bold mb-6 text-almost-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Manage the Entire Hiring Workflow
          </motion.h3>

          <motion.p
            className="text-gray-700 mb-8 max-w-xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            One unified platform for recruiters, team leads, and clients — reduce
            back-and-forth, streamline submissions, and make faster placements.
          </motion.p>

          <motion.ul
            className="space-y-4 text-gray-700"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {WORKFLOW.steps.map((step, idx) => (
              <motion.li
                key={idx}
                className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-300 cursor-pointer"
                variants={stepVariants}
              >
                <CheckCircleIcon className="w-6 h-6 text-[var(--hiring-lime)] flex-shrink-0" />
                <span className="font-medium">{step}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="#signup"
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Start Free Trial
            </a>
          </motion.div>
        </div>

        {/* Right Card */}
        <motion.div
          className="bg-white rounded-2xl p-6 soft-card shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-sm text-gray-500 mb-4 font-medium">Recent Activity</div>

          <div className="space-y-4">
            {WORKFLOW.ui.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg p-2">
                <div>
                  <div className="text-sm font-medium">{item.role} • {item.client}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
                <div className={`text-xs font-semibold ${item.color}`}>{item.status}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
