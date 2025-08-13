import React, { forwardRef } from "react";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "yellow" | "white" | "tangaroa";
  disabled?: boolean;
  circleButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  isArrow?: boolean;
  isYellow?: boolean;
  onClick?: () => void;
}

// Wrap component in forwardRef to accept ref
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "yellow",
      disabled = false,
      circleButton = false,
      children,
      className = "",
      isArrow = true,
      ...props
    },
    ref
  ) => {
    const baseClasses = `group relative text-[22px] font-700 text-primary pl-[18px] pr-[15px] py-[8.5px] inline-flex items-center justify-center text-center gap-[20px] rounded-full transition-all duration-200 ${
      circleButton
        ? "h-[36px] xs:h-[42px] sm:h-[55px] slg:h-[65px] w-[36] xs:w-[42px] sm:w-[55px] slg:w-[65px] !p-0"
        : "w-fit"
    }`;

    const getButtonStyles = () => {
      switch (variant) {
        case "yellow":
          return "bg-secondary hover:bg-white";
        case "white":
          return "bg-white hover:bg-secondary";
        case "tangaroa":
          return "bg-primary hover:bg-secondary";
        default:
          return "";
      }
    };

    const classes = getButtonStyles();

    return (
      <button
        ref={ref}
        className={`
        ${baseClasses}
        ${classes}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
        disabled={disabled}
        {...props}
      >
        {!circleButton && children}
        {!circleButton && isArrow && (
          <Image
            src="/icons/arrow_right_circle.svg"
            width={41}
            height={41}
            alt="arrow"
            className="rtl:-scale-x-100"
          />
        )}
        {circleButton &&
          (variant === "white" ? (
            <Image
              src="/icons/arrow_slide.svg"
              width={36}
              height={36}
              alt="arrow"
              className="absolute w-[16px] xs:w-[25px] sm:w-[30px] slg:w-[100%] max-w-[42px]"
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <>
              <Image
                src="/icons/arrow_slide_white.svg"
                width={36}
                height={36}
                alt="arrow"
                className="transition-opacity duration-300 group-hover:opacity-0 absolute w-[16px] xs:w-[25px] sm:w-[30px] slg:w-[100%] max-w-[42px]"
                style={{ pointerEvents: "none" }}
              />
              <Image
                src="/icons/arrow_slide.svg"
                width={36}
                height={36}
                alt="arrow-hover"
                className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute w-[16px] xs:w-[25px] sm:w-[30px] slg:w-[100%] max-w-[42px]"
                style={{ pointerEvents: "none" }}
              />
            </>
          ))}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
