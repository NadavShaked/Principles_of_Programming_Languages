import { expect } from "chai";
import { isNumExp, isBoolExp, isVarRef, isPrimOp, isProgram, isDefineExp, isVarDecl,
         isAppExp, isStrExp, isIfExp, isProcExp, isLetExp, isLitExp, isLetrecExp, isSetExp,
         parseL5Exp, unparse, Exp, parseL5, isValuesExp } from "../../part2/L5-ast";
import { Result, bind, isOkT, makeOk, isOk,isFailure } from "../../shared/result";
import { parse as parseSexp } from "../../shared/parser";
import { typeofExp, L5typeof } from '../../part2/L5-typecheck';
import { evalParse, evalProgram } from '../../part2/L5-eval';
import { isClosure, makeTupleSExp ,Value } from '../../part2/L5-value';
import { makeEmptyTEnv, makeExtendTEnv } from '../../part2/TEnv';
import { makeBoolTExp, makeNumTExp, makeProcTExp, makeTVar, makeVoidTExp, parseTE, unparseTExp } from '../../part2/TExp';
import {valueToString } from '../../part2/L5-value';

const incompatibleTypesPredicate = (res: Result<string>) =>
    isFailure(res) && res.message.startsWith("Incompatible types");
const p = (x: string): Result<Exp> => bind(parseSexp(x), parseL5Exp);

describe('Task 2.1 : L5-AST Test Unparse', () => {
    const roundTrip = (x: string): Result<string> => bind(p(x), unparse);

    it('unparses values', () => {
        const val = "(values 1 2 3)";
        expect(roundTrip(val)).to.deep.equal(makeOk(val));
    });

    it('unparses values', () => {
        const val = "(values 1)";
        expect(roundTrip(val)).to.deep.equal(makeOk(val));
    });

    it('unparses values', () => {
        const val = "(values 5 \"string\")";
        expect(roundTrip(val)).to.deep.equal(makeOk(val));
    });

    it('unparses values', () => {
        const val = "(values )";
        expect(roundTrip(val)).to.deep.equal(makeOk(val));
    });

    it('unparses "define" expressions with values', () => {
        const define = "(define f (lambda (x) (values x x x)))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    it('unparses "define" expressions with values', () => {
        const define = "(define f (lambda (x) (values x x x)))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    /*it('lambda with T1', () => {
        const define = "(define f (lambda ((x : T1)) (+ x x)))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });*/

    it('unparses "let-values"', () => {
        const let1 = "(let-values (((n s) (values 1 \"string\")) ((a b) (values 1 2))) b)";
        expect(roundTrip(let1)).to.deep.equal(makeOk(let1));
    });

    it('unparses "let-values"', () => {
        const let1 = "(let-values (((a b) (values 5 6))) a)";
        expect(roundTrip(let1)).to.deep.equal(makeOk(let1));
    });

    it('unparses "let-values"', () => {
        const let1 = "(let-values (((a b c) (f 0))) (+ a b c))";
        expect(roundTrip(let1)).to.deep.equal(makeOk(let1));
    });

});


describe('Task 2.2 : TExp Test Unparse', () => {
    const roundTrip = (x: string): Result<string> => bind(p(x), unparse);
    it('unparses tuples', () => {
        expect(bind(parseTE("(number * number)"),unparseTExp)).to.deep.equal(makeOk("(number * number)"));
        expect(bind(parseTE("(T1 * number)"),unparseTExp)).to.deep.equal(makeOk("(T1 * number)"));
        expect(bind(parseTE("((T1 -> boolean) * number)"),unparseTExp)).to.deep.equal(makeOk("((T1 -> boolean) * number)"));
        expect(bind(parseTE("(number -> (number -> number))"),unparseTExp)).to.deep.equal(makeOk("(number -> (number -> number))"));
        expect(bind(parseTE("(boolean * (boolean * number))"),unparseTExp)).to.deep.equal(makeOk("(boolean * (boolean * number))"));
        expect(bind(parseTE("(number * (boolean * (boolean * number)))"),unparseTExp)).to.deep.equal(makeOk("(number * (boolean * (boolean * number)))"));
    });

    it('unparses "define" expressions with values', () => {
        const define = "(define (f : (number -> (number * number))) (lambda ((x : number)) : (number * number) (values x (+ x 1))))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    it('unparses "define"function with values', () => {
        const define = "(define (g : (T1 -> (string * T1))) (lambda ((x : number)) : (string * number) (values \"x\" x)))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    it('unparses "define"function with values', () => {
        const define = "(define (y : (number * number)) (values 1 2))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    it('unparses "define" function with values', () => {
        const define = "(define (x : (boolean * (boolean * number))) (values #t (values #f 2)))";
        expect(roundTrip(define)).to.deep.equal(makeOk(define));
    });

    it('unparses nested values', () => {
        const exp = '(values 1 (values "abc" 7 #t) 3)';
        expect(roundTrip(exp)).to.deep.equal(makeOk(exp));
    });

});

describe('Task 2.4 : Evaluating', () => {
    it('evaluates values" expressions', () => {
        expect(evalParse('(values 1 2 3)')).to.deep.equal(makeOk(makeTupleSExp([1,2,3])));
        expect(evalParse('(values 1 #t)')).to.deep.equal(makeOk(makeTupleSExp([1,true])));
    });

    it('evaluates "define" expressions', () => {
        expect(bind(parseL5("(L5 (define f (lambda (x) (values x x x))) (f 5))"), evalProgram)).to.deep.equal(makeOk(makeTupleSExp([5,5,5])));
        expect(bind(parseL5("(L5 (define h (lambda (x) (values x (+ x 1)))) (h 4))"), evalProgram)).to.deep.equal(makeOk(makeTupleSExp([4,5])));
    });

    it('applies procedures', () => {
        expect(evalParse("((lambda (x) (values x x x)) 6)")).to.deep.equal(makeOk(makeTupleSExp([6,6,6])));
        expect(evalParse("((lambda () (values \"x\" 4)))")).to.deep.equal(makeOk(makeTupleSExp(["x",4])));
        
    });

    it('applies let-values', () => {
        expect(evalParse("(let-values (((n s) (values 1 \"string\")) ((a b) (values 1 2))) b)")).to.deep.equal(makeOk(2));
        expect(evalParse("(let-values (((n s) (values 1 2))((a b) (values 1 2))) (+ n s a b))")).to.deep.equal(makeOk(6));
        
    });

    it('applies let-values program', () => {
        expect(bind(parseL5("(L5 (define f (lambda (x) (values 1 2 3))) (let-values (((a b c) (f 0))) (+ a b c)))"), evalProgram)).to.deep.equal(makeOk(6));
        expect(bind(parseL5("(L5 (let-values (((a b) (values 1 2)) ((c d) (values 3 4))) (+ a b) (+ c d)))"), evalProgram)).to.deep.equal(makeOk(7));
        expect(bind(parseL5("(L5 (define f (lambda (x) (values x x))) (let-values (((a b) (f 1)) ((c d) (f 2)))(* c d)))"), evalProgram)).to.deep.equal(makeOk(4));
    });

    it('evaluates values" expressions', () => {
        expect(evalParse('(values 1 2 3)')).to.deep.equal(makeOk(makeTupleSExp([1,2,3])));
        expect(evalParse('(values 1 #t)')).to.deep.equal(makeOk(makeTupleSExp([1,true])));
    });

    it('evaluates "define" expressions', () => {
        expect(bind(parseL5("(L5 (define f (lambda (x) (values x x x))) (f 5))"), evalProgram)).to.deep.equal(makeOk(makeTupleSExp([5,5,5])));
        expect(bind(parseL5("(L5 (define h (lambda (x) (values x (+ x 1)))) (h 4))"), evalProgram)).to.deep.equal(makeOk(makeTupleSExp([4,5])));
    });

    it('applies procedures', () => {
        expect(evalParse("((lambda (x) (values x x x)) 6)")).to.deep.equal(makeOk(makeTupleSExp([6,6,6])));
        expect(evalParse("((lambda () (values \"x\" 4)))")).to.deep.equal(makeOk(makeTupleSExp(["x",4])));
        
    });

    it('applies let-values', () => {
        expect(evalParse("(let-values (((n s) (values 1 \"string\")) ((a b) (values 1 2))) b)")).to.deep.equal(makeOk(2));
        expect(evalParse("(let-values (((n s) (values 1 2))((a b) (values 1 2))) (+ n s a b))")).to.deep.equal(makeOk(6));
        
    });

    it('applies let-values program', () => {
        expect(bind(parseL5("(L5 (define f (lambda (x) (values 1 2 3))) (let-values (((a b c) (f 0))) (+ a b c)))"), evalProgram)).to.deep.equal(makeOk(6));
        expect(bind(parseL5("(L5 (let-values (((a b) (values 1 2)) ((c d) (values 3 4))) (+ a b) (+ c d)))"), evalProgram)).to.deep.equal(makeOk(7));
        expect(bind(parseL5("(L5 (define f (lambda (x) (values x x))) (let-values (((a b) (f 1)) ((c d) (f 2)))(* c d)))"), evalProgram)).to.deep.equal(makeOk(4));
        expect(evalParse('(values 1 2 3)')).to.deep.equal(makeOk(makeTupleSExp([1,2,3])));
        expect(evalParse('(values 1 #t)')).to.deep.equal(makeOk(makeTupleSExp([1, true])));
        expect(bind(parseL5('(L5 (let-values ((() (values))) 1))'), evalProgram)).to.deep.equal(makeOk(1));

    });

    it('unparses compund nested values', () => {
        const exp = '(values 1 (values "abc" 7 #t) 3)';
        const parsed = evalParse(exp);
        expect(bind(evalParse(exp), (value: Value) => makeOk(makeTupleSExp([1,makeTupleSExp(["abc", 7 , true]), 3]))));
    })
});
describe('Task 2.5 : Type cheking', () => {

    it('returns the types of values', () => {
        expect(L5typeof("(values 1 2 3)")).to.deep.equal(makeOk("(number * number * number)"));
        expect(L5typeof("(values \"string\" #t)")).to.deep.equal(makeOk("(string * boolean)"));
        expect(L5typeof("(values 1 (lambda((y : number)) : number (+ y y)))")).to.deep.equal(makeOk("(number * (number -> number))"));
    });

    it('returns the types of nested values', () => {
        expect(L5typeof("(values 1 2 (values 1))")).to.deep.equal(makeOk("(number * number * (number))"));
        expect(L5typeof("(values \"string\" (values 1 #t))")).to.deep.equal(makeOk("(string * (number * boolean))"));
        expect(L5typeof("(values 1 2 (values 1) 3)")).to.deep.equal(makeOk("(number * number * (number) * number)"));
    });

    it('returns the type of "let-values" expressions', () => {
        expect(L5typeof("(let (((x : number) 1) ((y : number) 2)) (lambda((a : number)) : number (+ (* x a) y)))")).to.deep.equal(makeOk("(number -> number)"));
        expect(L5typeof("(let-values ((((a : number) (b : number)) (values 5 6))) a)")).to.deep.equal(makeOk("number"));
    });


    it('returns the type of procedures', () => {
        expect(L5typeof("(lambda ((x : number)) : (number * number) (values x x))")).to.deep.equal(makeOk("(number -> (number * number))"));
        expect(L5typeof("(lambda ((x : number)) : (number * number) (values x (+ x 1)))")).to.deep.equal(makeOk("(number -> (number * number))"));
        expect(L5typeof("(lambda () : (string * number) (values \"x\" 4))")).to.deep.equal(makeOk("(Empty -> (string * number))"));
    });

    it('returns "void" as the type of "define" expressions', () => {
        expect(L5typeof("(define ( f : (T1 -> (T1 * T1))) (lambda ((x : number)) (values x x)))")).to.deep.equal(makeOk("void"));
    });


});


describe('parseTE', () => {      
    it('parses atoms', () => {
        expect(L5typeof(`(values 1 2 (values 4 3))`)).to.deep.equal(makeOk(`(number * number * (number * number))`));
        expect(L5typeof(`(let-values ((((n : number) (s : string)) (values 1 "string")) (((a : number) (b : number)) (values 1 2))) b)`)).to.deep.equal(makeOk(`number`));
        expect(L5typeof(`(lambda () : (number * number) (values 1 2))`)).to.deep.equal(makeOk(`(Empty -> (number * number))`));
        expect(L5typeof(`((lambda ((x : number)) : (number * number * number) (values x x x)) 6)`)).to.deep.equal(makeOk(`(number * number * number)`));
        expect(L5typeof(`(let-values ((((a : number) (b : number)) (values 5 6))) a)`)).to.deep.equal(makeOk(`number`));
        expect(L5typeof("(let-values ((((a : number) (b : number) (c : number)) ((lambda ((x : number)) : (number * number * number) (values 1 2 3)) 0 ))) (+ a b))")).to.deep.equal(makeOk(`number`));
        expect(L5typeof(`(values)`)).to.deep.equal(makeOk(`(Empty)`));
        

    });

    it('typeof let-values fails when there\'s a mismatch between tuples length and binding variables count', () => {
        expect(L5typeof(`
(let-values
((((b : number)) (values))
 (() (values))
 ((a) (values 5))) a)
`)).to.satisfy(incompatibleTypesPredicate);

        expect(L5typeof(`
(let-values
((() (values))
 (((b : boolean) (c : string)) (values #t "my string" 5 2))
 ((a) (values 5))) a)
`)).to.satisfy(incompatibleTypesPredicate);
    });
});