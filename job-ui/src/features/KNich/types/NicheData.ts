export type NodeType = "idea" | "niche" | "subniche" | "micro";

export interface NodeMetadata {
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
  isDeleted: boolean;
}

export interface EdgeMetadata {
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
  isDeleted: boolean;
}

export interface NicheNode {
  id: string;
  label: string;
  type: NodeType;
  metadata: NodeMetadata;
  snapshotVersion: number;
  parentId: string | null;
}

export interface NicheEdge {
  id: string;
  source: string;
  target: string;
  metadata: EdgeMetadata;
  snapshotVersion: number;
}

export interface NicheData {
  nodes: NicheNode[];
  edges: NicheEdge[];
}
