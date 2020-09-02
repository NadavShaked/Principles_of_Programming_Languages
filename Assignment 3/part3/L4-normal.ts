// ========================================================
// L4 normal eval
import { Sexp } from "s-expression";
import { map } from "ramda";
import { CExp, Exp, IfExp, Program, parseL4Exp, VarDecl, LetExp, Binding, isLetExp } from "./L4-ast";
import { isAppExp, isBoolExp, isCExp, isDefineExp, isIfExp, isLitExp, isNumExp,
         isPrimOp, isProcExp, isStrExp, isVarRef } from "./L4-ast";
import { applyEnv, makeEmptyEnv, Env, makeExtEnv } from './L4-env-normal';
import { applyPrimitive } from "./evalPrimitive";
import { isClosure, makeClosure, Value, Closure } from "./L4-value";
import { first, rest, isEmpty } from '../shared/list';
import { Result, makeOk, makeFailure, bind, mapResult } from "../shared/result";
import { parse as p } from "../shared/parser";

export const isTrueValue = (x: Value): boolean =>
    ! (x === false);

const L4normalEval = (exp: CExp, env: Env): Result<Value> =>
    isNumExp(exp) ? makeOk(exp.val) :
    isBoolExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? bind(applyEnv(env, exp.var), (exp: CExp) => L4normalEval(exp, env)) :
    isLitExp(exp) ? makeOk(exp.val) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? makeOk(makeClosure(exp.args, exp.body, env)) :
    isLetExp(exp) ? evalLet(exp, env) :
    //sLetrecExp(exp) ? evalLetrec(exp, env) :
    isAppExp(exp) ? bind(L4normalEval(exp.rator, env), proc => L4normalApplyProc(proc, exp.rands, env)) :
    makeFailure(`Bad L4 AST ${exp}`);

// Evaluate a sequence of expressions (in a program)
export const evalExps = (exps: Exp[], env: Env): Result<Value> =>
    isEmpty(exps) ? makeFailure("Empty exp") :
    isDefineExp(first(exps)) ? evalDefineExps(first(exps), rest(exps), env) :
    evalCExps(first(exps), rest(exps), env);

const evalCExps = (first: Exp, rest: Exp[], env: Env): Result<Value> =>
    isCExp(first) && isEmpty(rest) ? L4normalEval(first, env) :
    isCExp(first) ? evalExps(rest, env) :
    makeFailure("Never");

// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def: Exp, exps: Exp[], env: Env): Result<Value> =>
    isDefineExp(def) ? evalExps(exps, makeExtEnv([def.var.var], [def.val], env)) :
    makeFailure("Unexpected " + def);
    
export const evalNormalProgram = (program: Program): Result<Value> =>
    evalExps(program.exps, makeEmptyEnv());

export const evalNormalParse = (s: string): Result<Value> =>
    bind(p(s),
         (parsed: Sexp) => bind(parseL4Exp(parsed),
                                (exp: Exp) => evalExps([exp], makeEmptyEnv())));

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(L4normalEval(exp.test, env),
        test => isTrueValue(test) ? L4normalEval(exp.then, env) : L4normalEval(exp.alt, env));

const L4normalApplyProc = (proc: Value, args: CExp[], env: Env): Result<Value> => {
    if (isPrimOp(proc)) {
        const argVals: Result<Value[]> = mapResult((arg) => L4normalEval(arg, env), args);
        return bind(argVals, (args: Value[]) => applyPrimitive(proc, args));
    } else if (isClosure(proc)) {
        return applyClosure(proc, args);
    } else {
        return makeFailure(`Bad proc applied ${proc}`);
    }
};

const applyClosure = (proc: Closure, args: CExp[]): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    return evalExps(proc.body, makeExtEnv(vars, args, proc.env));
}

// LET: Direct evaluation rule without syntax expansion
// compute the values, extend the env, eval the body.
const evalLet = (exp: LetExp, env: Env): Result<Value> => {
    const vars = map((b: Binding) => b.var.var, exp.bindings);
    const vals = map((b: Binding) => b.val, exp.bindings);
    return evalExps(exp.body, makeExtEnv(vars, vals, env));
}