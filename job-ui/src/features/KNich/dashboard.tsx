import { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ChevronDown,
  Plus,
  Search,
  Home,
  HelpCircle,
  Settings,
  Folder,
} from "lucide-react";
import { NicheData, NicheEdge, NicheNode } from "./types/NicheData";
import dagre from "dagre";

interface Props {
  initialData: NicheData;
  onBack: () => void;
}
const nodeColorMap = {
  idea: "#A7F3D0",
  niche: "#BFDBFE",
  subniche: "#DDD6FE",
  micro: "#FDE68A",
};
const SPACING_X = 250;
const SPACING_Y = 150;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 80;

function getLayoutedElements(nodes: any[], edges: any[], direction = "TB") {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "top";
    node.sourcePosition = "bottom";

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

const KNichDashboard: React.FC<Props> = ({ initialData, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    // Transform domain data to ReactFlow nodes
    const flowNodes: Node[] = initialData.nodes.map((n: NicheNode) => ({
      id: n.id,
      data: { label: n.label },
      style: {
        background: nodeColorMap[n.type] ?? "#e5e7eb",
        borderRadius: 6,
        padding: 10,
        border: "2px solid #ccc",
      },
      position: { x: 0, y: 0 }, // dagre will override
    }));

    const flowEdges: Edge[] = initialData.edges.map((e: NicheEdge) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true,
    }));

    return getLayoutedElements(flowNodes, flowEdges, "TB");
  }, [initialData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = () => {
    const newNode: Node = {
      id: `new-${Date.now()}`,
      data: { label: "New Niche" },
      style: {
        background: "#94A3B8",
        color: "#fff",
        borderRadius: 8,
        padding: 10,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position: { x: 0, y: 0 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <div className="font-semibold">ketan's Workspace</div>
              <div className="text-xs text-gray-500 flex items-center">
                1 member <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm border-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <div className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help center</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings & members</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
            <Folder className="w-4 h-4" />
            <span className="text-sm">New room</span>
          </div>
        </nav>

        <div className="p-4 border-t mt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Today</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full mt-1"></div>
              <div className="text-sm">
                {/* <div className="font-medium">
                  {initialData || "Current niche project"}
                </div> */}
                <div className="text-gray-500 text-xs">
                  You will have to fight the boss.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
              <div className="text-sm">
                <div className="font-medium">Tech stack analysis</div>
                <div className="text-gray-500 text-xs">What is needed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            >
              <span>← Back to Input</span>
            </button>
            <h1 className="text-xl font-semibold">Niche Tree: </h1>
            <button
              onClick={addNewNode}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Niche</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">K</span>
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg">
              Share
            </button>
          </div>
        </div>

        {/* React Flow Area */}
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
export default KNichDashboard;
