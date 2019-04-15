
load('immutable.js');

// The data for this test has 1,000,000 items stored into a map.
const data_size = 1000*1000;
const iterations = 100*1000;

function initialData() {
    return Immutable.Range(0, data_size).map(x => "value " + x).toMap();
}

function bench(label, f) {
    const start = dateNow();
    const r = f();
    const end = dateNow();
    console.log(label + " " + (end - start) + "ms");
    return r;
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

const i = bench("Generate initial data", initialData);

function test(initial) {
    var d = initial;
    for (var i = 0; i < iterations; i++) {
        // Each iteration retrives two random items and sets one random item.
        d.get(randInt(data_size - 1));
        d.get(randInt(data_size - 1));
        d = d.set(randInt(data_size - 1, "iteration " + i));
    }
    return d;
}

bench("Run test", () => test(i));

