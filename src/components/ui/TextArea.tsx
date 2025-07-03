import { TextAreaProps } from "@/interfaces/global";
import React from "react";

const TextArea: React.FC<TextAreaProps> = ({
  className = "",
  wrapperClassName = "",
  disabled = false,
  ...props
}) => {
  return (
    <div
      className={`bg-basic-primary rounded-lg overflow-hidden flex border border-accent-secondary  w-full ${
        disabled
          ? "opacity-50"
          : "hover:border-accent-primary-hover active:border-accent-primary-pressed"
      } ${wrapperClassName}`}
    >
      <textarea
        disabled={disabled}
        className={`w-full outline-none rounded-lg body1-regular text-trim-none leading-[140%] text-basic-primary placeholder:text-basic-primary px-[24px] py-[20px] ${className} ${
          disabled ? "cursor-not-allowed" : "cursor-auto"
        }`}
        {...props}
      />
    </div>
  );
};

export default TextArea;
