import { filter, Pred , reject, curry, compose} from "ramda";
import { type } from "os";

/* Question 1 */
export const partition: <T>(pred: (x: T) => boolean, arr: T[]) => T[][] = <T>(pred: (x: T) => boolean, arr: T[]) : T[][] => [arr.filter(pred), arr.filter(x => !pred(x))];

/* Question 2 */
export const mapMat: <T, U>(func: (x: T) => U, matrix: T[][]) => U[][] = <T, U>(func: (x: T) => U, matrix: T[][]) => matrix.map(row => row.map(cell => func(cell)));
    
/* Question 3 */
export const composeMany: <T>(func: ((x: T) => T)[]) => ((x: T) => T) = <T>(funcArr: ((x: T) => T)[]) => funcArr.reduce((acc, cur) => (input) => acc(cur(input)), (input) => input);

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

export const maxSpeed: (pokemonsArray: Pokemon[]) => Pokemon[] = (pokemonsArray: Pokemon[]): Pokemon[] => {
    const max : number = pokemonsArray.reduce((acc: number, cur: Pokemon) => (acc < cur.base.Speed) ? acc = cur.base.Speed : acc, 0);
    return pokemonsArray.filter((pokemon: Pokemon) => pokemon.base.Speed === max);
};

export const grassTypes: (pokemonArray: Pokemon[]) => string[] = (pokemonArray: Pokemon[]) => pokemonArray.filter((pokemon: Pokemon) => pokemon.type.reduce((acc: boolean, cur: string) => acc = acc || (cur === "Grass"), false) === true).map((pokemon: Pokemon) => pokemon.name.english).sort();

export const uniqueTypes: (pokemonArray: Pokemon[]) => string[] = (pokemonArray: Pokemon[]) => pokemonArray.reduce((acc: string[], cur: Pokemon) =>  acc.concat(cur.type.filter((pokemonType: string) => acc.indexOf(pokemonType) === -1)), []).sort();
