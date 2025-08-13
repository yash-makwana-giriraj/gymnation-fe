import { InputProps } from "@/interfaces/global";
import Image from "next/image";
import React from "react";

const Input: React.FC<InputProps> = ({
  placeholder,
  disabled = false,
  leftIcon,
  varient ="trial",
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`${varient === "search"?"bg-basic-primary px-[24px] py-[11.5px] rounded-full flex border border-accent-secondary gap-[8px] w-full":"border border-gray-e4 bg-gray-e4 px-[13px] mb:px-[20px] lp:px-[23px] py-[6px] mb:py-[11px] lp:py-[14px]  h-[34px] mb:h-[44px] sm:h-[46px] lp:h-[50px] rounded-full flex gap-[8px] w-full"}  ${className}
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
          className={`w-full outline-none body1-regular text-trim-none leading-[13px] text-basic-primary placeholder:text-basic-primary ${varient === "trial" && "placeholder:text-primary font-500 text-[13px] mb:text-[16px]  leading-[20px] "} ${
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
