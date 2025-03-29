"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow
} from "@xyflow/react";
import React from "react";

/**
 * DeletableEdge Component.
 *
 * Renders a custom edge for a React Flow diagram that includes a delete button.
 * The component calculates a smooth step path for the edge and positions a button
 * on the edge label. When the button is clicked, the edge is removed from the flow.
 *
 * @param {EdgeProps} props - The properties for the edge, including geometry and styling.
 * @returns {JSX.Element} The rendered deletable edge component.
 */
export default function DeletableEdge(props: EdgeProps) {
  // Calculate the smooth step path for the edge along with label coordinates.
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  // Obtain the setEdges function from the React Flow context to update edges.
  const { setEdges } = useReactFlow();

  return (
    <>
      {/* Render the base edge with the computed path and provided style and marker */}
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      {/* Render the edge label that contains a delete button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all"
          }}
        >
          <Button
            variant={"outline"}
            size={"icon"}
            className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg hover:text-red-500"
            onClick={() => {
              // Update the edges by filtering out the edge with the current id.
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
            }}
          >
            X
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
