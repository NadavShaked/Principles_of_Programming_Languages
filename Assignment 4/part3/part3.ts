function* braid(gen1:() => Generator<any>, gen2:() => Generator<any>) /* Generator */ {
    let cr1: Iterator<any> = gen1();
    let cr2: Iterator<any> = gen2();
    let ir1: IteratorResult<any> = cr1.next();
    let ir2: IteratorResult<any> =  cr2.next();

    while (!ir1.done  && !ir2.done) {
        yield ir1.value;
        yield ir2.value;

        ir1 = cr1.next();
        ir2 = cr2.next();
    }

    while (!ir1.done) {
        yield ir1.value;
        ir1 = cr1.next();
    }

    while (!ir2.done) {
        yield ir2.value;
        ir2 = cr2.next();
    }
}

function* biased(gen1:() => Generator<any>, gen2:() => Generator<any>) /* Generator */ {
    let cr1: Iterator<any> = gen1();
    let cr2: Iterator<any> = gen2();
    let ir1: IteratorResult<any> = cr1.next();
    let ir2: IteratorResult<any> =  cr2.next();

    while (!ir1.done  && !ir2.done) {
        yield ir1.value;
        ir1 = cr1.next();
        if (!ir1.done)
            yield ir1.value;
        ir1 = cr1.next();
        yield ir2.value;

        ir2 = cr2.next();
    }

    while (!ir1.done) {
        yield ir1.value;
        ir1 = cr1.next();
    }

    while (!ir2.done) {
        yield ir2.value;
        ir2 = cr2.next();
    }
}