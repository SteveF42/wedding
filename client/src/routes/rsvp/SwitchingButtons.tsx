import { useState } from "react";

type SwitchingButtonsProps = {
  value: "ACCEPTED" | "DECLINED";
  onChange: (value: "ACCEPTED" | "DECLINED") => void;
};

function SwitchingButtons({ value, onChange }: SwitchingButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("ACCEPTED")}
        className={`px-4 py-2 rounded transition-colors flex-1 ${
          value === "ACCEPTED" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}>
      WILL ATTEND
      </button>
      <button
        type="button"
        onClick={() => onChange("DECLINED")}
        className={`px-4 py-2 rounded transition-colors flex-1 ${
          value === "DECLINED" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}>
      WILL NOT ATTEND
      </button>
    </div>
  );
}

export default SwitchingButtons;
