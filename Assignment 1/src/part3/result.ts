import { reduce } from "ramda";

/* Question 3 */
export type Result<T> = Ok<T> | Failure;

interface Ok<T> {
    tag: "Ok";
    value: T;
}

interface Failure{
    tag: "Failure";
    message: String;
}

export const makeOk = <T>(value: T): Result<T> => ({tag: "Ok", value: value});
export const makeFailure = <T>(message:String): Result<T> => ({tag: "Failure", message: message});

export const isOk = <T>(result: Result<T>): result is Ok<T> => result.tag === "Ok";
export const isFailure = <T>(result:Result<T>): result is Failure => result.tag === "Failure";

/* Question 4 */
export const bind = <T,U>(oldResult: Result<T>, f: (x: T) => Result<U>): Result<U> => {
    return isOk(oldResult) ? f(oldResult.value) : oldResult;
};

/* Question 5 */
interface User {
    name: string;
    email: string;
    handle: string;
}

const validateName = (user: User): Result<User> =>
    user.name.length === 0 ? makeFailure("Name cannot be empty") :
    user.name === "Bananas" ? makeFailure("Bananas is not a name") :
    makeOk(user);

const validateEmail = (user: User): Result<User> =>
    user.email.length === 0 ? makeFailure("Email cannot be empty") :
    user.email.endsWith("bananas.com") ? makeFailure("Domain bananas.com is not allowed") :
    makeOk(user);

const validateHandle = (user: User): Result<User> =>
    user.handle.length === 0 ? makeFailure("Handle cannot be empty") :
    user.handle.startsWith("@") ? makeFailure("This isn't Twitter") :
    makeOk(user);

export const naiveValidateUser = (user: User): Result<User> => {
    let result = validateName(user);
    isOk(result) ? result = validateEmail(result.value) : result = result;
    isOk(result) ? result = validateHandle(result.value) : result = result;
    return result;
};

export const monadicValidateUser = (user: User): Result<User> => {
    return reduce(bind, validateName(user), [validateEmail, validateHandle]);
};