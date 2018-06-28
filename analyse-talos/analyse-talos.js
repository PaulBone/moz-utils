// Copyright: Mozilla

loadRelativeToScript("jstat.js");

scriptArgs.forEach(file => {
    let json = JSON.parse(read(file))
    json.suites.forEach(suite => {
        let opts = suite.extraOptions.join(", ");
        print(`Suite: ${suite.name} opts: ${opts}`);
        if (suite.subtests) {
            suite.subtests.forEach(subtest => {
                let unit = subtest.unit ? subtest.unit : ""; 
                print(`  Subtest: ${subtest.name}`);
                print(`    value: ${subtest.value}${unit}`);
                if (subtest.replicates) {
                    stats = new jStat.jStat(subtest.replicates);
                    print(`    num:    ${subtest.replicates.length}`);
                    print(`    mean:   ${stats.mean().toPrecision(3)}${unit}`);
                    print(`    median: ${stats.median()}${unit}`);
                    print(`    stdev:   ${stats.stdev().toPrecision(3)}${unit}`);
                }
            });
        }
        print();
    });
});

