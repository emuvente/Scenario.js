(function (w, d) {

    "use strict";

    var Namespace = "Scenario",

        Tester = Tester || function (testName, testProps) {

            var 
            cache = {
                ranTests: {}
            },
            tests = {},
            utils = {
                track: function(name, props, fn){
                    if( typeof props !== "undefined" ){
                        mixpanel.track( name, props, fn );
                    } else {
                        mixpanel.track( name, false, fn );
                    }
                },
                toSlug: function (s) {
                    return s.toLowerCase().replace(/-+/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                },
                extend: function(target, source){
                    for(var i in source) {
                        target[i] = source[i];
                    }
                    return target;
                },
                // pick a random index from the given weighted values array
                weightedRandom: function(weights) {
                    var total = 0;

                    for(var i in weights) {
                        total += weights[i];
                    }

                    var highend = total,
                        selected,
                        r = Math.random() * total;

                    for(var i in weights) {
                        if(highend-weights[i] <= r && r < highend) {
                            selected = i;
                        }
                        highend -= weights[i];
                    }

                    return selected;
                },
                random: function(max) {
                    return Math.floor(Math.random() * max);
                }
            },
            Public = {
                test: function (name, weight, fn) {
                    if(typeof name != 'string') {
                        throw "Scenario.test(): 'name' must be a string";
                    }
                    if(weight != undefined) {
                        if(typeof weight != 'number') {
                            throw "Scenario.test(): 'weight' must be a number";
                        }
                        if(weight == 0) {
                            throw "Scenario.test(): 'weight' cannot be zero";
                        }
                    }
                    if(fn != undefined && typeof fn != 'function') {
                        throw "Scenario.test(): 'fn' must be a function";
                    }

                    tests[testName].push({
                        name: name,
                        weight: weight,
                        fn: fn
                    });

                    return this;
                },
                go: function() {
                    var weights = [],
                        weighted = true;

                    for(var i in tests[testName]) {
                        if(tests[testName][i].weight === undefined) {
                            weighted = false;
                            break;
                        }
                        weights[i] = tests[testName][i].weight;
                    }

                    if(weighted) {
                        w.localStorage["scenario-"+testName] = w.localStorage["scenario-"+testName] || utils.weightedRandom(weights);
                    }
                    else {
                        w.localStorage["scenario-"+testName] = w.localStorage["scenario-"+testName] || utils.random(tests[testName].length);
                    }

                    var test = tests[testName][w.localStorage["scenario-"+testName]],
                        slug = utils.toSlug(test.name);

                    d.body.className += " "+slug;

                    cache.ranTests[testName] = test.name;
                    
                    utils.track(testName+" Mid", utils.extend({
                        test: test.name
                    }), testProps);
                    
                    if (typeof test.fn === "function") {
                        test.fn.call(null, {
                            name: test.name,
                            slug: slug
                        });
                    }
                    
                    this.complete = function(fn){
                        utils.track(testName+" Finish", testProps, fn);
                    };

                    this.reset = function() {
                        delete w.localStorage["scenario-"+testName];
                    };
                    return this;
                }
            };

            tests[testName] = tests[testName] || [];
            
            utils.track(testName+" Start", testProps);
            
            return Public;
        };

    this[Namespace] = Tester;
    
}).call(this, window, document);
