import { InputProps } from "@/interfaces/global";
import Image from "next/image";
import React from "react";

const Input: React.FC<InputProps> = ({
  placeholder,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-basic-primary px-[24px] py-[11.5px] rounded-full flex border border-accent-secondary gap-[8px] w-full ${className}
        ${
          disabled
            ? "opacity-50"
            : "hover:border-accent-primary-hover active:border-accent-primary-pressed"
        }
      `}
    >
      <div className="flex gap-[8px] w-full">
        {leftIcon && (
          <Image width={20} height={20} src={leftIcon} alt="Searchicon" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full outline-none body1-regular text-trim-none leading-[13px] text-basic-primary placeholder:text-basic-primary ${
            disabled ? "cursor-not-allowed" : "cursor-auto"
          }`}
          disabled={disabled}
          {...props}
        />
      </div>
      {rightIcon && (
        <Image width={20} height={20} src={rightIcon} alt="Searchicon" />
      )}
    </div>
  );
};

export default Input;
