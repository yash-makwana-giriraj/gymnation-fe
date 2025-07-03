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
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "yellow",
  disabled = false,
  circleButton = false,
  children,
  className = "",
  isArrow = true,
  ...props
}, ref) => {
  const baseClasses = `group relative text-[22px] font-700 text-primary pl-[18px] pr-[15px] py-[8.5px] inline-flex items-center justify-center gap-[20px] rounded-full transition-all duration-200 w-fit ${circleButton ? "h-[65px] !w-[65px] !p-0" : ""}`;

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
      {circleButton && (
        <>
          <Image
            src="/icons/arrow_slide_white.svg"
            width={36}
            height={36}
            alt="arrow"
            className="rtl:-scale-x-100 transition-opacity duration-300 group-hover:opacity-0 absolute right-[15px] top-1/2 -translate-y-1/2"
            style={{ pointerEvents: "none" }}
          />
          <Image
            src="/icons/arrow_slide.svg"
            width={36}
            height={36}
            alt="arrow-hover"
            className="rtl:-scale-x-100 transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute right-[15px] top-1/2 -translate-y-1/2"
            style={{ pointerEvents: "none" }}
          />
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
