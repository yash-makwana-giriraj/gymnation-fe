import React from "react";
import parse from "html-react-parser";
import { DynamicComponentData } from "@/interfaces/content";

const LargeTextComponent = ({ data }: { data: DynamicComponentData }) => {


  return (
    <div className="global-spacing mx-auto !pb-0 text-center">
      <div className="rte-content text-primary">
        {parse(data.largeText.markup)}
      </div>
    </div>
  );
};

export default LargeTextComponent;
