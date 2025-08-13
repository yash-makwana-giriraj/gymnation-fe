import React from "react";
import parse from "html-react-parser";
import { DynamicComponentData } from "@/interfaces/content";
import { usePathname } from "next/navigation";

const Description = ({ data }: { data: DynamicComponentData }) => {
    const pathname = usePathname();

    const content =
        typeof data.description === "string"
            ? data.description
            : data.description.markup;

    return (
        <div className={`description global-spacing mx-auto text-center ${pathname.includes('aboutgymnearme') ? '!pb-0' : ''}`}>
            <div className={`container !mx-auto lp:!max-w-[1372px] text-primary text-sm  ${pathname.includes('/gymsnearme') ? '' : 'font-semibold'} xs:text-[22px] md:text-xl`}>
                {parse(content)}
            </div>
        </div>
    );
};

export default Description;
