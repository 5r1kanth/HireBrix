import React from "react";
import { overviewBoxes } from "@/data/consultantData";

export default function Overview() {
  return (
    <div className="bg-white h-full rounded-md shadow p-2 flex flex-col gap-4">
      {/* Row A: Overview + Current Position */}
      <div className="flex justify-between items-start">
        {/* Overview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Srikanth Pamulapati</h3>
        </div>

        {/* Present Working Position */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500">Senior UI Developer</p>
        </div>
      </div>

      {/* Row B: Three boxes */}
      <div className="grid grid-cols-3 gap-2 h-full">
        {overviewBoxes.map((box, index) => (
          <div
            key={index}
            className={`${box.bgColor} ${box.hoverColor} rounded-md p-3 flex flex-col justify-center text-center border ${box.borderColor}`}
          >
            <p className={`text-sm ${box.textColor}`}>{box.title}</p>
            <p className={`text-xl font-bold ${box.valueColor}`}>{box.value}</p>
            <p className={`text-sm ${box.textColor}`}>{box.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
