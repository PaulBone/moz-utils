
// TODO: for my own curiosity find out why the 234 tree is MUCH slower than
// the splay tree.  I think it's that it branches less and therefor does
// more pointer-following.

// Disable pretenuring
gcparam('pretenureThreshold', 100);

load('234tree.js');

const samples = 20;

function initialData(data_size) {
    var tree = Tree234.empty();
    for (var i = 0; i < data_size; i++) {
        tree = Tree234.set(tree, i, "value " + i);
    }
    return tree;
}

function bench(f, reps = 1) {
    var sum = 0;
    var sums = 0;
    var r;
    for (var i = 0; i < reps; i++) {
        const start = dateNow();
        r = f();
        const end = dateNow();
        const dur = end - start;
        sum += dur;
        sums += dur*dur;
    }
    const mean = sum / reps;
    const stdev = (sums / reps) - (mean * mean);
    return { result: r, time: (sum / reps), stdev: stdev };
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

function log_header() {
    console.log("size,create time,heap before,heap after, test time, stdev, gc time 1,gc time 2");
}

function log(size, create_time, heap_before, heap_after, test_time,
        test_stdev, gc_time_1, gc_time_2) {
    console.log(`${size},${create_time},${heap_before},${heap_after},${test_time},${test_stdev},${gc_time_1},${gc_time_2}`);
}

function test(data_size, iterations) {
    const initial_bench = bench(() => initialData(data_size));
    const initial = initial_bench.result;

    const gc_time_1 = bench(() => gc('shrinking')).time;

    const total_heap_before = gcparam('gcBytes') / 1024;

    function test_loop() {
        var d = initial;
        for (var i = 0; i < iterations*3; i += 3) {
            // Each iteration retrives two random items and sets one random item.
            Tree234.get(d, randoms[i] % data_size);
            Tree234.get(d, randoms[i+1] % data_size);
            d = Tree234.set(d, randoms[i+2] % data_size, "iteration " + i);
        }
        return d;
    }

    const test = bench(test_loop, samples);
    const gc_time_2 = bench(() => gc('shrinking')).time;

    const total_heap_after = gcparam('gcBytes') / 1024;

    //console.log(`Size: ${data_size}, Heap: ${total_heap_before}KB delta ${total_heap_after - total_heap_before}KB Time: ${test_time}ms`);
    //console.log(`\tGC time: ${gc_time_1 + gc_time_2}ms`);
    //console.log(`\tInitial data: ${initial_bench.time}ms`);
    log(data_size, initial_bench.time, total_heap_before, total_heap_after, 
        test.time, test.stdev, gc_time_1, gc_time_2);
}

// The data for this test has 1,000,000 items stored into a map.
console.log("\nwarmup");
test(40000, 50000);
for (var i = 30*1000; i < 40*1000; i += 1*1000) {
    // test(i, 100);
}

console.log("Re-aquiring baseline memory usage");
bench(() => gc('shrinking'));
console.log("randoms size: " + Math.floor(byteSize(randoms) / 1024) + "KB");
console.log("Total Heap: " + (gcparam('gcBytes') / 1024) + "KB");

console.log("\nrun test");
gcparam('minNurseryBytes', 1024*1024);
gcparam('maxNurseryBytes', 1024*1024);
log_header();
for (var i = 50; i < 500; i += 10) {
    test(i, 50*1000);
}
quit();
for (var i = 500; i < 40*1000; i += 500) {
    test(i, 50*1000);
}

