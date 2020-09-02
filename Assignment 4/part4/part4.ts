import { any, reject } from "ramda";
import { resolve } from "dns";
import { rejects } from "assert";

// ---------------------------------------------------------------- Part 4 Question 1 ---------------------------------------------------------------- //
const fPromise = (x: number): Promise<number> => {
    return new Promise<number>( (resolve, reject) => {
        if(x === 0)
            reject("division by 0 is not possible");
        else
            resolve(1/x);
    })
}

const gPromise = (x: number): Promise<number> => {
    return new Promise<number>( (resolve, reject) => {
        resolve(x*x);
    })
}

const hPromise = (x: number): Promise<number> => {
    return new Promise<number>( (resolve, reject) => {
        gPromise(x).then(gX => fPromise(gX).then(fX => resolve(fX)).catch(fX => reject(fX))).catch(gX => reject(gX));
    })
}

// ---------------------------------------------------------------- Part 4 Question 2 ---------------------------------------------------------------- //
const slower = (promisesArray: Promise<any>[]): Promise<any[]> => {
    let isSlower : Boolean = false;
    return new Promise<any[]>( (resolve, reject) => {
        promisesArray[0].then(val => { isSlower? resolve([0, val]) : isSlower = true}).catch(val => reject(console.log(val)));
        promisesArray[1].then(val => { isSlower? resolve([1, val]) : isSlower = true}).catch(val => reject(console.log(val)));
    });
}