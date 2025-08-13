"use client";

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import closeIcon from '../../../public/icons/close-icon.svg';
import Image from "next/image";
import Button from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
    className?: string;
    overlayClassName?: string;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
    overlayClassName = "",
    showCloseButton = true,
}) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const handleCloseAnimation = useCallback(() => {
        setAnimateIn(false);
        setAnimateOut(true);
        document.body.style.overflow = "";

        setTimeout(() => {
            setShouldRender(false);
            if (onClose) onClose();
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setAnimateOut(false);
            document.body.style.overflow = "hidden";

            setTimeout(() => setAnimateIn(true), 10);
        } else if (shouldRender) {
            handleCloseAnimation();
        }
    }, [isOpen, shouldRender, handleCloseAnimation]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[999] flex items-center justify-center bg-[#f6f6f6e8] backdrop-blur-[4px] bg-opacity-50 ${overlayClassName}`}
            onClick={handleCloseAnimation}
        >
            <div
                className={`relative transition-all duration-300 transform
                ${animateIn ? "translate-y-0 opacity-100" : ""}
                ${animateOut ? "-translate-y-[30px] opacity-0" : ""}
                ${!animateIn && !animateOut ? "-translate-y-[20px] opacity-0" : ""}
                ${className}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && (
                    <Button
                        onClick={handleCloseAnimation}
                        isArrow={false}
                        variant="tangaroa"
                        className="!absolute top-3 right-6 md:right-8 lg:right-12 z-999 !p-0 flex items-center justify-center rounded-full bg-primary hover:!bg-primary text-white hover:bg-opacity-90 transition"
                        aria-label="Close"
                    >
                        <Image
                            src={closeIcon}
                            height={10}
                            width={10}
                            alt="Close"
                            className="w-6 h-6 md:w-10 md:h-10"
                        />
                    </Button>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
