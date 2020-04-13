import { filter, Pred , reject, curry, compose} from "ramda";
import { type } from "os";

/* Question 1 */
export const partition: (pred: Pred, arr: any[]) => any[][] = (pred: Pred, arr: any[]) : any[][] => [arr.filter(pred,arr), reject(pred, arr)];

/* Question 2 */
export const mapMat: (func: Function, matrix: any[][]) => any[][] = (func:Function, matrix: any[][]) => matrix.map(x => x.map(y => func(y)));
    
/* Question 3 */
export const composeMany: (func: Function[]) => any = (funcArr:Function[]) => funcArr.reduce((acc:Function, cur:Function) => (input: any) => acc(cur(input)), (input: Function) => input);

/* Question 4 */
interface Languages {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
}

interface Stats {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
}

interface Pokemon {
    id: number;
    name: Languages;
    type: string[];
    base: Stats;
}

export const maxSpeed : (pokemonsArray : Pokemon[]) => Pokemon[] = (pokemonsArray : Pokemon[]) : Pokemon[] => {
    //delete
    let max : number = pokemonsArray.reduce((acc : number, cur : Pokemon) => (acc < cur.base.Speed) ? acc = cur.base.Speed : acc, 0);
    return pokemonsArray.filter((pokemon:Pokemon) => pokemon.base.Speed === max);
};

export const grassTypes = (pokemonArray:Pokemon[]) => pokemonArray.filter((pokemon:Pokemon) => pokemon.type.reduce((acc: boolean, cur: string) => acc = acc || (cur === "Grass"), false) === true).map((pokemon:Pokemon)=>pokemon.name.english).sort();

export const uniqueTypes = (pokemonArray:Pokemon[]) => pokemonArray.reduce((acc:String[], cur:Pokemon) =>  acc.concat(cur.type.filter((pokemonType:String) => acc.indexOf(pokemonType) === -1)), []).sort();