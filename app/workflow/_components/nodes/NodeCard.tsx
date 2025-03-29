"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode, useEffect } from "react";

/**
 * NodeCard Component.
 *
 * Renders a card container for a node in the flow diagram. It displays its children
 * and conditionally applies styling based on the node's selection state and validation status.
 * When double-clicked, the view is centered on the node using its position.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.nodeId - The unique identifier of the node.
 * @param {ReactNode} props.children - The content to be rendered inside the node card.
 * @param {boolean} props.isSelected - Indicates whether the node is currently selected.
 * @returns {JSX.Element} The rendered NodeCard component.
 */
export default function NodeCard({
  children,
  nodeId,
  isSelected
}: {
  nodeId: string;
  children: ReactNode;
  isSelected: boolean;
}) {
  // Access functions from the React Flow context to get node data and center the view.
  const { getNode, setCenter } = useReactFlow();

  // Retrieve invalid input information from the flow validation hook.
  const { invalidInputs } = useFlowValidation();
  // Determine if the current node has invalid inputs.
  const hasInvalidInputs = invalidInputs?.some(
    (node) => node.nodeId === nodeId
  );

  console.log("hasInvalidInputs: nodeCard", invalidInputs);

  useEffect(() => {
    console.log("Updated Invalid Inputs: nodeCard", invalidInputs);
  }, [invalidInputs]);

  /**
   * nodeSetParams - Centers the view on the node.
   *
   * Retrieves the node's position and measured dimensions. Computes the center point and then
   * uses the setCenter function to focus the view on that position.
   */
  const nodeSetParams = () => {
    const node = getNode(nodeId);
    if (!node) return;
    const { position, measured } = node;
    if (!position || !measured) return;
    const { width, height } = measured;
    const x = position.x + width! / 2;
    const y = position.y + height! / 2;

    if (x === undefined || y === undefined) return;
    setCenter(x, y, {
      zoom: 1,
      duration: 500
    });
  };

  return (
    <div
      onDoubleClick={() => nodeSetParams()}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 borer-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
}
