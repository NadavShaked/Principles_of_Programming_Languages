// ===========================================================
// AST type models

/*
;; =============================================================================
;; Scheme Parser
;; 
<graph> ::= <header> <graphContent> // Graph(dir: Dir, content: GraphContent)
<header> ::= graph (TD|LR)<newline> // Direction can be TD or LR
<graphContent> ::= <atomicGraph> | <compoundGraph>
<atomicGraph> ::= <nodeDecl>
<compoundGraph> ::= <edge>+
<edge> ::= <node> --><edgeLabel>? <node><newline> // <edgeLabel> is optional
// Edge(from: Node, to: Node, label?: string)
<node> ::= <nodeDecl> | <nodeRef>
<nodeDecl> ::= <identifier>["<string>"] // NodeDecl(id: string, label: string)
<nodeRef> ::= <identifier> // NodeRef(id: string)
<edgeLabel> ::= |<identifier>| // string
;;
;; ==============================================================================
*/

export type GraphContent = AtomicGraph | CompoundGraph;
export type AtomicGraph = NodeDecl;
export type Node = NodeDecl | NodeRef;

export interface Graph { tag: "Graph"; header: Header, content: GraphContent; } 
export interface Header { tag: "Header"; dir: "TD" | "LR"; }
export interface CompoundGraph { tag: "CompoundGraph"; edges: Edge[]; }
export interface Edge { tag: "Edge"; from: Node, to: Node, label?: string; }
export interface NodeDecl { tag: "NodeDecl"; id: string, label: string; }
export interface NodeRef { tag: "NodeRef"; id: string; }
export interface EdgeLabel { tag: "EdgeLabel"; var: string; }

export const makeGraph = (header: Header, content: GraphContent): Graph => ({ tag: "Graph", header: header, content: content });
export const makeHeader = (dir: "TD" | "LR"): Header => ({ tag: "Header", dir: dir });
export const makeCompoundGraph = (edges: Edge[]): CompoundGraph => ({ tag: "CompoundGraph", edges: edges });
export const makeEdge = (from: Node, to: Node, label?: string): Edge => ({ tag: "Edge", from: from, to: to, label: label });
export const makeNodeDecl = (id: string, label: string): NodeDecl => ({ tag: "NodeDecl", id: id, label: label });
export const makeNodeRef = (id: string): NodeRef => ({ tag: "NodeRef", id: id });
export const makeEdgeLabel = (v: string): EdgeLabel => ({ tag: "EdgeLabel", var: v });

export const isGarph = (x: any): x is Graph => x.tag === "Graph";
export const isHeader = (x: any): x is Header => x.tag === "Header";
export const isCompoundGraph = (x: any): x is CompoundGraph => x.tag === "CompoundGraph";
export const isEdge = (x: any): x is Edge => x.tag === "Edge";
export const isNodeDecl = (x: any): x is NodeDecl => x.tag === "NodeDecl";
export const isNodeRef = (x: any): x is NodeRef => x.tag === "NodeRef";
export const isEdgeLabel = (x: any): x is EdgeLabel => x.tag === "EdgeLabel";

export const isGraphContent = (x: any): x is GraphContent => isAtomicGraph(x) || isCompoundGraph(x);
export const isAtomicGraph = (x: any): x is AtomicGraph  => isNodeDecl(x);
export const isNode = (x: any): x is Node => isNodeDecl(x) || isNodeRef(x);