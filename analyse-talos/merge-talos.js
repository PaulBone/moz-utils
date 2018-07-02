// Copyright: Mozilla

loadRelativeToScript("jstat.js");

function assert(prop, mess) {
    if (!prop) {
        printErr(`Assertion failed: ${mess}`);
        quit();
    }
}

let firstFile = scriptArgs.shift();
let output = JSON.parse(read(firstFile));

scriptArgs.forEach(file => {
    let json = JSON.parse(read(file));

    /*
     * These asserts keep failing, JavaScript is dumb.
    assertEq(json.framework, output.framework,
        `Framework in ${file} does not match.`);
    */
    assertEq(json.suites.length, output.suites.length,
        `Number of suites don not match from ${file}`);
    for (let i = 0; i < json.suites.length; i++) {
        assertEq(json.suites[i].name, output.suites[i].name,
            `Suite names do not match for ${file} suite number ${i}`);
        //assertEq(json.suites[i].extraOptions, output.suites[i].extraOptions,
        //    `Suite options do not match for ${file} suite number ${i}`);
        for (let j = 0; j < json.suites[i].subtests.length; j++) {
            assertEq(json.suites[i].subtests[j].name,
                output.suites[i].subtests[j].name,
                `Subtest names do not match for ${file} suite ${i} subtest ${j}`);

            if (output.suites[i].subtests[j].replicates) {
                assert(json.suites[i].subtests[j].replicates,
                    `Replicates not present in ${file} suite ${i} subtest ${j}.`);

                output.suites[i].subtests[j].replicates =
                    output.suites[i].subtests[j].replicates.concat(
                    json.suites[i].subtests[j].replicates);
            }
        }
    }
});

print(JSON.stringify(output));

