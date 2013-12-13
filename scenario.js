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
                }
            },
            Public = {
                test: function (name, fn) {
                    tests[testName].push({
                        name: name,
                        fn: fn
                    });
                    return this;
                },
                go: function() {
                    w.localStorage["scenario-"+testName] = w.localStorage["scenario-"+testName] || Math.floor(Math.random() * tests[testName].length);

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
