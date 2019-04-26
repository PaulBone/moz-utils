
// Disable pretenuring
gcparam('pretenureThreshold', 100);

load('234tree.js');

function initialData(data_size) {
    var tree = Tree234.empty();
    for (var i = 0; i < data_size; i++) {
        tree = Tree234.set(tree, i, "value " + i);
    }
    return tree;
}

function bench(f) {
    const start = dateNow();
    const r = f();
    const end = dateNow();
    return { result: r, time: (end - start), };
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

const max_iterations = 1000*1000;
const max_data_size = 1000*1000;

function makeRandoms() {
    var randoms = [];
    for (var i = 0; i < max_iterations*3; i++) {
        randoms[i] = randInt(max_data_size);
    }
    return randoms;
}

const randoms = makeRandoms();

console.log("Getting baseline memory usage");
bench(() => gc('shrinking'));
console.log("randoms size: " + Math.floor(byteSize(randoms) / 1024) + "KB");
console.log("Total Heap: " + (gcparam('gcBytes') / 1024) + "KB");

function test(data_size, iterations) {
    const initial_ = initialData(data_size);
    gc('shrinking');

    const total_heap_before = gcparam('gcBytes') / 1024;

    function test_loop(initial) {
        var d = initial;
        for (var i = 0; i < iterations*3; i += 3) {
            // Each iteration retrives two random items and sets one random item.
            Tree234.get(d, randoms[i] % data_size);
            Tree234.get(d, randoms[i+1] % data_size);
            d = Tree234.set(d, randoms[i+2] % data_size, "iteration " + i);
        }
        return d;
    }

    const test_time = bench(() => test_loop(initial_)).time;

    gc('shrinking');
    const total_heap_after = gcparam('gcBytes') / 1024;
    
    console.log(`Size: ${data_size}, Heap: ${total_heap_before}KB delta ${total_heap_after - total_heap_before}KB Time: ${test_time}ms`);

} 

// The data for this test has 1,000,000 items stored into a map.
console.log("\nwarmup");
for (var i = 300*1000; i < 400*1000; i += 10*1000) {
    test(i, 1000);
}

console.log("\nrun test");
gcparam('minNurseryBytes', 1024*1024);
gcparam('maxNurseryBytes', 1024*1024);
for (var i = 100; i < 10*1000; i += 100) {
    test(i, 10000);
}

