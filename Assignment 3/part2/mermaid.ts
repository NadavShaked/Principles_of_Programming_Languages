import { Graph, isAtomicGraph, GraphContent, isCompoundGraph, Edge, Node, isNodeDecl, isNodeRef, makeEdge, makeNodeDecl, makeCompoundGraph, makeNodeRef, makeGraph, AtomicGraph, makeHeader, CompoundGraph, NodeRef, NodeDecl } from "./mermaid-ast";
import { Result, makeOk, mapResult, safe2, makeFailure, bind, isOk } from "../shared/result";
import { map, is } from "ramda";
import { AtomicExp, isNumExp, Parsed, isExp, isProgram, Exp,  isCExp, isDefineExp, CExp, isAtomicExp, isCompoundExp, isVarRef, isPrimOp, isBoolExp, isStrExp, isLetrecExp, LetrecExp, SetExp, CompoundExp, isAppExp, isIfExp, isProcExp, isLetExp, isLitExp, AppExp, IfExp, ProcExp, LetExp, LitExp, Program, Binding, parseL4, parseL4Exp,  } from "./L4-ast";
import { isNumber, isBoolean, isString, isSymbol } from "util";
import { CompoundSExp, isSymbolSExp, isEmptySExp, isCompoundSExp, isClosure, SExpValue } from "./L4-value";
import { Sexp } from "s-expression";
import { parse } from "../shared/parser";

const makeVarGen = (): (v: string) => string => {
    let count: number = 0;
    return (v: string) => {
        count++;
        return `${v}__${count}`;
    };
};

const uniqueExps : (value: string) => (string) = makeVarGen();
const uniqueProgram : (value: string) => (string) = makeVarGen();
const uniqueDefine : (value: string) => (string) = makeVarGen();
const uniqueVarDecl : (value: string) => (string) = makeVarGen();
const uniqueNumExp : (value: string) => (string) = makeVarGen();
const uniqueStringExp : (value: string) => (string) = makeVarGen();
const uniqueBoolExp : (value: string) => (string) = makeVarGen();
const uniqueVarRef : (value: string) => (string) = makeVarGen();
const uniquePrimOp : (value: string) => (string) = makeVarGen();
const uniqueAppExp : (value: string) => (string) = makeVarGen();
const uniqueRands : (value: string) => (string) = makeVarGen();
const uniqueIfExp : (value: string) => (string) = makeVarGen();
const uniqueProcExp : (value: string) => (string) = makeVarGen();
const uniqueParams : (value: string) => (string) = makeVarGen();
const uniqueBody : (value: string) => (string) = makeVarGen();
const uniqueLetExp : (value: string) => (string) = makeVarGen();
const uniqueBinding : (value: string) => (string) = makeVarGen();
const uniqueCompoundSExp : (value: string) => (string) = makeVarGen();
const uniqueNumber : (value: string) => (string) = makeVarGen();
const uniqueBoolean : (value: string) => (string) = makeVarGen();
const uniqueString : (value: string) => (string) = makeVarGen();
const uniqueSymbol : (value: string) => (string) = makeVarGen();
const uniqueEmptySExp : (value: string) => (string) = makeVarGen();
const uniqueLitExp : (value: string) => (string) = makeVarGen();
const uniqueSetExp : (value: string) => (string) = makeVarGen();

export const mapL4toMermaid = (exp: Parsed): Result<Graph> =>
    isExp(exp) ? makeOk(makeGraph(makeHeader("TD"), fixFirst(expToMermaid(exp)))) :
    isProgram(exp) ? makeOk(makeGraph(makeHeader("TD"), programToMermaid(exp))) : 
    exp;

const fixFirst = (graph: GraphContent): GraphContent => {
    if(isCompoundGraph(graph) && graph.edges.length > 0) {
            const edges : Edge[] = graph.edges;
            const fromNode : Node = graph.edges[0].from;
            const toNode : Node = graph.edges[0].to;
            const addEdge : Edge = makeEdge(convertNodeRefToNodeDecl(fromNode), toNode, edges[0].label);
            return makeCompoundGraph([addEdge].concat(graph.edges.slice(1, graph.edges.length)));
    }
   return graph;
}

const subGraphMerger = (graph: GraphContent, colonNodeName: string) : Edge[] => {
    if(isAtomicGraph(graph))
        return [makeEdge(makeNodeRef(colonNodeName), graph)];
    else
        return [makeEdge(makeNodeRef(colonNodeName), convertNodeRefToNodeDecl(graph.edges[0].from))].concat(graph.edges);
}

const createGraphArray = (arr: Exp[]) : GraphContent[] => 
    arr.map((e: Exp) => expToMermaid(e));

const convertNodeRefToNodeDecl = (node: Node) : NodeDecl => 
    makeNodeDecl(node.id, node.id.substring(0, node.id.indexOf('_')));

const programToMermaid = (program: Program) : GraphContent => {
    const uniqueExpId : string = uniqueExps("Exps");
    const graph : CompoundGraph =  makeCompoundGraph([makeEdge(makeNodeDecl(uniqueProgram(program.tag),program.tag), makeNodeDecl(uniqueExpId, ":"), "exps")].concat(
                    createGraphArray(program.exps).map((graphContent) => subGraphMerger(graphContent, uniqueExpId)).reduce((acc: Edge[], cur: Edge[])=> acc.concat(cur), [])))
    return graph;
};

const expToMermaid = (exp: Exp) : GraphContent => {
    if(isCExp(exp)) 
        return cexpToMermaid(exp) 
    else {
        const uniqueDefineId = uniqueDefine(exp.tag);
        const subGraph: GraphContent = cexpToMermaid(exp.val);
        const graph: GraphContent = makeCompoundGraph([makeEdge(makeNodeDecl(uniqueDefineId, exp.tag), makeNodeDecl(uniqueVarDecl(exp.var.tag), `${exp.var.tag}(${exp.var.var})`), "var"), 
                                                        makeEdge(makeNodeRef(uniqueDefineId), isCompoundGraph(subGraph)? convertNodeRefToNodeDecl(subGraph.edges[0].from) : subGraph , "val")].concat(isCompoundGraph(subGraph)? subGraph.edges : []));
        return graph;
    }
}

const cexpToMermaid = (exp: CExp) : GraphContent => {
    if(isAtomicExp(exp))
        return atomicExpToMermaid(exp);
    else
        return compoundToMermaid(exp);
}    

const atomicExpToMermaid = (exp: AtomicExp) : GraphContent => {
    if(isNumExp(exp))
        return makeNodeDecl(uniqueNumExp(exp.tag), `${exp.tag}(${exp.val})`);
    else if(isBoolExp(exp)) {
        if(exp.val)
            return makeNodeDecl(uniqueBoolExp(exp.tag), `${exp.tag}(#t)`);
        else
            return makeNodeDecl(uniqueBoolExp(exp.tag), `${exp.tag}(#f)`);
    }
    else if(isStrExp(exp))
        return makeNodeDecl(uniqueStringExp(exp.tag), `${exp.tag}(${exp.val})`);
    else if(isVarRef(exp))
        return makeNodeDecl(uniqueVarRef(exp.tag), `${exp.tag}(${exp.var})`);
    else
        return makeNodeDecl(uniquePrimOp(exp.tag), `${exp.tag}(${exp.op})`);
}

const compoundToMermaid = (exp: CompoundExp) : GraphContent => {
    if(isIfExp(exp))
        return ifExpToMermaid(exp);
    else if(isProcExp(exp))
        return procExpToMermaid(exp)
    else if(isAppExp(exp))
        return appExpToMermaid(exp);
    else if(isLetExp(exp))
        return letToMermaid(exp);
    else if(isLetrecExp(exp))
        return letToMermaid(exp);
    else if(isLitExp(exp))
        return litToMermaid(exp);
    else
        return setToMermaid(exp);
}   

const appExpToMermaid = (exp: AppExp) : GraphContent => {
    const uniqueAppExpId : string = uniqueAppExp(exp.tag);
    const uniqueRandId : string = uniqueRands("Rands");
    const subGraph : GraphContent = cexpToMermaid(exp.rator);
    const graph : CompoundGraph =  makeCompoundGraph([makeEdge(makeNodeRef(uniqueAppExpId), isCompoundGraph(subGraph)? convertNodeRefToNodeDecl(subGraph.edges[0].from) : subGraph, "rator"),
                                        makeEdge(makeNodeRef(uniqueAppExpId), makeNodeDecl(uniqueRandId, ":") , "rands")].concat(isCompoundGraph(subGraph)? subGraph.edges : [])
                                    .concat(createGraphArray(exp.rands).map((graphContent) => subGraphMerger(graphContent, uniqueRandId)).reduce((acc: Edge[], cur: Edge[])=> acc.concat(cur), [])));
    return graph;
}

const ifExpToMermaid = (exp: IfExp) : GraphContent => {
    const uniqueIfExpId : string = uniqueIfExp(exp.tag);
    const subGraphs : GraphContent[] = [exp.test, exp.then, exp.alt].map((exp) => cexpToMermaid(exp)); 
    const graph : CompoundGraph =  makeCompoundGraph([makeEdge(makeNodeRef(uniqueIfExpId), isCompoundGraph(subGraphs[0])? convertNodeRefToNodeDecl(subGraphs[0].edges[0].from): subGraphs[0], "test"),
                                                        makeEdge(makeNodeRef(uniqueIfExpId), isCompoundGraph(subGraphs[1])? convertNodeRefToNodeDecl(subGraphs[1].edges[0].from): subGraphs[1], "then"),
                                                        makeEdge(makeNodeRef(uniqueIfExpId), isCompoundGraph(subGraphs[2])? convertNodeRefToNodeDecl(subGraphs[2].edges[0].from): subGraphs[2], "alt")]
                                                        .concat(getEdgesArray(subGraphs)));
    return graph;
}

const getEdgesArray = (graphs: GraphContent[]) : Edge[] => {
    const edgesArray : Edge[] = graphs.reduce((acc: Edge[], cur: GraphContent) => isCompoundGraph(cur)? acc.concat(cur.edges): acc, []);
    return edgesArray;
}

const procExpToMermaid = (exp: ProcExp) : GraphContent => {
    const uniqueProcExpId : string = uniqueProcExp(exp.tag);
    const uniqueArgsId : string = uniqueParams("Params");
    const uniqueBodyId : string = uniqueBody("Body");
    const argsEdgesArray : Edge[] = exp.args.map((x) => makeEdge(makeNodeRef(uniqueArgsId), makeNodeDecl(uniqueVarDecl(x.tag), `${x.tag}(${x.var})`)));
    const graph : GraphContent =  makeCompoundGraph([makeEdge(makeNodeRef(uniqueProcExpId), makeNodeDecl(uniqueArgsId, ":") , "args"), makeEdge(makeNodeRef(uniqueProcExpId), makeNodeDecl(uniqueBodyId, ":"), "body")]
                                                    .concat(argsEdgesArray).concat(createGraphArray(exp.body).map((graphContent) => subGraphMerger(graphContent, uniqueBodyId)).reduce((acc: Edge[], cur: Edge[])=> acc.concat(cur), [])));
    return graph;
}

const letToMermaid = (exp: LetExp | LetrecExp) : GraphContent => {
    const uniqueLetExpId : string = uniqueLetExp(exp.tag);
    const uniqueBodyId : string = uniqueBody("Body");
    const uniqueBindingId : string = uniqueBinding("Binding");
    const graph : GraphContent =  makeCompoundGraph([makeEdge(makeNodeRef(uniqueLetExpId), makeNodeDecl(uniqueBodyId, ":") , "body"),
                                                        makeEdge(makeNodeRef(uniqueLetExpId), makeNodeDecl(uniqueBindingId, ":") , "bindings"),]
                                                    .concat(makeArrayForBindings(exp.bindings).map((graphContent) => subGraphMerger(graphContent, uniqueBindingId)).reduce((acc: Edge[], cur: Edge[])=> acc.concat(cur), [])
                                                    .concat(createGraphArray(exp.body).map((graphContent) => subGraphMerger(graphContent, uniqueBodyId)).reduce((acc: Edge[], cur: Edge[])=> acc.concat(cur), []))));
    return graph;
}

const makeArrayForBindings = (bindings : Binding[]) : GraphContent[] => {
    return bindings.map((bind: Binding) => bindToMermaid(bind));
}

const bindToMermaid = (binding: Binding) : GraphContent => {
    const uniqueBindingId : string = uniqueBinding(binding.tag);
    const subGraph : GraphContent = cexpToMermaid(binding.val);
    const graph : GraphContent =  makeCompoundGraph([makeEdge(makeNodeRef(uniqueBindingId), makeNodeDecl(uniqueVarDecl(binding.var.tag), `${binding.var.tag}(${binding.var.var})`), "var"),
                                                        makeEdge(makeNodeRef(uniqueBindingId), isCompoundGraph(subGraph)? convertNodeRefToNodeDecl(subGraph.edges[0].from) : subGraph , "val")].concat(isCompoundGraph(subGraph)? subGraph.edges : []))
    return graph;                                                
};

const compundSExpToMermaid = (exp : CompoundSExp) : GraphContent => {
    const uniqueCompoundSExpId = uniqueCompoundSExp(exp.tag);
    const graph : GraphContent =  makeCompoundGraph(makeCompoundEdges(exp.val1, uniqueCompoundSExpId, "1").concat(makeCompoundEdges(exp.val2, uniqueCompoundSExpId, "2")));
    return graph;
}

const makeCompoundEdges = (exp: SExpValue, compId: string, label: string): Edge[] => {
    if(isNumber(exp))
        return [makeEdge(makeNodeRef(compId),makeNodeDecl(uniqueNumber("number"),`number(${exp})`), `val${label}`)];
    else if(isBoolean(exp))
        return [makeEdge(makeNodeRef(compId),makeNodeDecl(uniqueBoolean("boolean"),`boolean(${exp})`), `val${label}`)];
    else if(isString(exp))
        return [makeEdge(makeNodeRef(compId),makeNodeDecl(uniqueString("string"),`string(${exp})`), `val${label}`)];
    else if(isPrimOp(exp))
        return [makeEdge(makeNodeRef(compId),makeNodeDecl(uniquePrimOp("PrimOp"),`PrimOp(${exp.op})`), `val${label}`)];
    else if (isSymbolSExp(exp))
        return [makeEdge(makeNodeRef(compId), makeNodeDecl(uniqueSymbol("SymbolSExp"), "SymbolSExp"), `val${label}`)];
    else if (isEmptySExp(exp))
        return [makeEdge(makeNodeRef(compId), makeNodeDecl(uniqueEmptySExp("EmptySExp"), "EmptySExp"), `val${label}`)];
    else if (isClosure(exp))
        return [];
    else {
        const graph : GraphContent = compundSExpToMermaid(exp);
        return [makeEdge(makeNodeRef(compId),isCompoundGraph(graph)? convertNodeRefToNodeDecl(graph.edges[0].from) : graph, `val${label}`)].concat(isCompoundGraph(graph)? graph.edges : []);
    }
}

const litToMermaid = (exp: LitExp) : GraphContent => {
    const uniqueLitExpId : string = uniqueLitExp(exp.tag);
    if(isNumber(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId),makeNodeDecl(uniqueLitExp(exp.tag),`${exp.tag}(${exp.val})`), "val")]);
    else if(isBoolean(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId),makeNodeDecl(uniqueLitExp(exp.tag),`${exp.tag}(${exp.val})`), "val")]);
    else if(isString(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId),makeNodeDecl(uniqueLitExp(exp.tag),`${exp.tag}(${exp.val})`), "val")]);
    else if(isPrimOp(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId),makeNodeDecl(uniqueLitExp(exp.tag),`${exp.tag}(${exp.val})`), "val")]);
    else if (isSymbolSExp(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId), makeNodeDecl(uniqueSymbol("SymbolSExp"), "SymbolSExp"), "val")]);
    else if (isEmptySExp(exp.val))
        return makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId), makeNodeDecl(uniqueEmptySExp("EmptySExp"), "EmptySExp"), "val")]);
    else if (isClosure(exp.val))
        return makeCompoundGraph([]);
    else {
        const subGraph : GraphContent = compundSExpToMermaid(exp.val);
        const graph : GraphContent = makeCompoundGraph([makeEdge(makeNodeRef(uniqueLitExpId),isCompoundGraph(subGraph)? convertNodeRefToNodeDecl(subGraph.edges[0].from) : subGraph, "val")].concat(isCompoundGraph(subGraph)? subGraph.edges : []));
        return graph;
    }
}

const setToMermaid = (exp: SetExp) : GraphContent => {
    const uniqueSetExpId : string = uniqueSetExp(exp.tag);
    const subGraph : GraphContent = cexpToMermaid(exp.val);
    const graph : GraphContent = makeCompoundGraph([makeEdge(makeNodeDecl(uniqueSetExpId, exp.tag), makeNodeDecl(uniqueVarRef(exp.var.tag), `${exp.var.tag}(${exp.var.var})`), "var"), 
                                                    makeEdge(makeNodeRef(uniqueSetExpId), isCompoundGraph(subGraph)? convertNodeRefToNodeDecl(subGraph.edges[0].from) : subGraph, "val")].concat(isCompoundGraph(subGraph)? subGraph.edges : []));
    return graph;
}


export const unparseMermaid = (exp: Graph): Result<string> =>
    makeOk(`graph ${exp.header.dir}\n\t${unparseContent(exp.content)}`);

const unparseContent = (exp: GraphContent): string => {
    if(isAtomicGraph(exp))
        return `${exp.id}["${exp.label}"]`;
    else
        return map(unparseEdge, exp.edges).join('\n\t');
}

const unparseEdge = (edge: Edge): string =>
    edge.label ? `${unparseNode(edge.from)} --> |${edge.label}| ${unparseNode(edge.to)}` :
                `${unparseNode(edge.from)} --> ${unparseNode(edge.to)}`;

const unparseNode = (node: Node): string=> {
    if(isNodeDecl(node))
        return `${node.id}["${node.label}"]`;
    else
        return `${node.id}`;
}

export const L4toMermaid = (concrete: string): Result<string>=> {
        const parsedProgram = parseL4(concrete);
        const pardedExp = isOk(parsedProgram)? mapL4toMermaid(parsedProgram.value):
                                 bind(parse(concrete),(sexp: Sexp)=> bind(parseL4Exp(sexp),(exp:Exp)=>mapL4toMermaid(exp)))   
        return bind(pardedExp,(graph: Graph)=> unparseMermaid(graph));
}