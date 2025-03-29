"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent";
import { AppNode } from "@/types/appNodes";
import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

// Define custom node and edge types for React Flow.
const nodeTypes = {
  WebSweepNode: NodeComponent
};

const edgeTypes = {
  default: DeletableEdge
};

// Configuration for snap grid and view fitting options.
const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 1
};

/**
 * FlowEditor Component.
 *
 * This component renders the workflow editor using React Flow. It loads the workflow definition
 * (nodes, edges, viewport) from the provided workflow object and enables features such as:
 * - Drag-and-drop to create new nodes.
 * - Connecting nodes with edges, with validation to prevent cycles and mismatched types.
 * - Updating the viewport, nodes, and edges dynamically.
 *
 * @param {Object} props - Component properties.
 * @param {WorkFlow} props.workflow - The workflow object containing the flow definition and metadata.
 * @returns {JSX.Element} The rendered FlowEditor component.
 */
export default function FlowEditor({ workflow }: { workflow: any }) {
  // Manage nodes and edges state.
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  // Load the workflow definition (nodes, edges, viewport) from JSON.
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      // Handle error silently.
    }
  }, [workflow.definition, setEdges, setNodes, setViewport]);

  /**
   * onDragOver handler.
   *
   * Prevents the default behavior and sets the drop effect to "move" when a draggable item
   * is dragged over the React Flow canvas.
   *
   * @param {React.DragEvent} event - The drag event.
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * onDrop handler.
   *
   * Handles dropping of a draggable task item onto the canvas. It retrieves the task type
   * from the dataTransfer object, calculates the flow position from the screen coordinates,
   * creates a new node for the task, and adds it to the nodes state.
   *
   * @param {React.DragEvent} event - The drop event.
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      // Convert screen coordinates to flow coordinates.
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      // Create and add the new node.
      const newNode = CreateFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  /**
   * onConnect handler.
   *
   * Called when a new connection (edge) is created between nodes. It adds an animated edge,
   * resets the target node input value, and logs the update.
   *
   * @param {Connection} connection - The connection object representing the new edge.
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((nd) => nd.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: { ...nodeInputs, [connection.targetHandle]: "" }
      });
      console.log("@UPDATED NODES", node.id);
    },
    [setEdges, updateNodeData, nodes]
  );

  /**
   * isValidConnection function.
   *
   * Validates whether a proposed connection (edge) is allowed. It prevents self-connections,
   * ensures that both source and target nodes exist, checks type compatibility between the
   * source output and target input, and verifies that adding the connection does not create a cycle.
   *
   * @param {Edge | Connection} connection - The connection object to validate.
   * @returns {boolean} True if the connection is valid, false otherwise.
   */
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // Prevent self-connections.
      if (connection.source === connection.target) return false;
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.error("invalid connection source or target node");
        return false;
      }
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];

      // Check if the output and input types match.
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
      );

      if (input?.type !== output?.type) {
        console.error("invalid connection type mismatch");
        return false;
      }
      /**
       * hasCycle - Detects cycles in the graph starting from a given node.
       *
       * @param {AppNode} node - The node from which to start cycle detection.
       * @param {Set<string>} visited - A set to track visited node IDs.
       * @returns {boolean} True if a cycle is detected, false otherwise.
       */
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, edges]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
