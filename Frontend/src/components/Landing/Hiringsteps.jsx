import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { HIRINGSTEPS } from "../../data/Landing";

export default function HiringSteps() {

  const firstRow = HIRINGSTEPS.steps.slice(0, 3);
  const secondRow = HIRINGSTEPS.steps.slice(3);

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const arrowVariant = {
    animate: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.2 } },
  };

  const renderRow = (rowSteps) => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
      {rowSteps.map((step, index) => (
        <React.Fragment key={index}>
          <motion.div
            className="p-4 sm:p-6 bg-white rounded-lg shadow text-center flex flex-col justify-center 
                       w-[90%] sm:w-64 h-32 sm:h-40 hover:scale-105 transition-transform"
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="font-semibold mb-1">{step.title}</div>
            <div className="text-sm text-gray-600">{step.description}</div>
          </motion.div>
          {index < rowSteps.length - 1 && (
            <motion.div
              className="hidden sm:block"
              variants={arrowVariant}
              animate="animate"
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-400" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="bg-secondary rounded-lg min-h-full flex flex-col justify-center py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Get to hiring in minutes</h3>
        <p className="text-gray-700 mb-12">
          Create a workspace, import candidates, track submissions and interviews,
          and analyze performance — all in one place.
        </p>

        <div className="flex flex-col items-center gap-4 sm:gap-8">
          {renderRow(firstRow)}
          {renderRow(secondRow)}
        </div>
      </div>
    </section>
  );
}
