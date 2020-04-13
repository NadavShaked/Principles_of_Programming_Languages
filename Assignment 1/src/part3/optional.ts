/* Question 1 */
export type Optional<T> = Some<T> | None;

interface Some<T> {
    tag: "Some";
    value: T;
}

interface None{
    tag: "None";
}

export const makeSome = <T>(value:T): Optional<T> => ({tag: "Some", value: value});
export const makeNone = <T>(): Optional<T> => ({tag: "None"});;

export const isSome = <T>(opt: Optional<T>): opt is Some<T> => opt.tag === "Some";
export const isNone = <T>(opt: Optional<T>): opt is None => opt.tag === "None";

/* Question 2 */
export const bind = <T, U>(oldOpt: Optional<T>, f: (x: T) => Optional<U> ): Optional<U> => {
    return isSome(oldOpt) ? f((<Some<T>>oldOpt).value) : oldOpt;
};