import React from "react";
import { RadioButtonProps } from "@/interfaces/global";

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <label
      className={`flex items-center gap-[12px] w-fit  body1-regular leading-[140%] ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <input type="radio" disabled={disabled} {...props} />
      <span className="block">{label}</span>
    </label>
  );
};

export default RadioButton;
