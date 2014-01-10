Scenario
========

A lightweight A/B Testing library for use with MixPanel


Install
-------

```html
<script type="text/javascript" src="mixpanel.js"></script>
<script type="text/javascript" src="scenario.js"></script>
```


Usage
-----

```javascript
var test = new Scenario('My Test Name', {prop: 'Additional property to track'})
           .test('Variant A', 10, function(name, slug) { //setup this test variant })
           .test('Variant B', 20)
           .go();

test.complete();
```


API
---

    Scenario( String testName, Object testProps )

 - Initializes a new test and returns two functions, `test`, and `go`.


    test( String name[, number weight, function fn] )

 - Adds a test variant.
 - `name` is the name of the variant. The `<body>` has this name added to it in the form of a slug, so `"Test Case A"` will be added to the body as `"test-case-a"`.
 - `weight` is an optional weight to give the variant when selecting.
 - `fn` is an optional function may be passed in the third parameter that will execute if the test case is chosen.


    go()

 - Rolls the dice and calls one of the variants.
 - Returns the instance based method(s) `complete`.


    complete()

 - Finishes the test sequence.


MixPanel Integration
--------------------

MixPanel is required with Scenario.

Once the `go()` function has been called, the initial tracking event occurs:

```javascript
mixpanel.track( "My Test Name Start" );
```

Shortly after a test is chosen, another tracking event occurs. This one records the test case used:

```javascript
mixpanel.track("My Test Name Mid", {
    test: "Test A"
});
```

Once the `complete()` function has been called, the final tracking occurs: 

```javascript
mixpanel.track( "My Test Name Finish" );
```


Creating the Funnel
-------------------

Navigate to MixPanel and click Funnels. Create a funnel that includes the testName Load, testName, and testName Finish, then click `Save`.

<img src="http://i.imgur.com/CXZzolm.png">


Practical Examples
------------------

```javascript
var test = new Scenario( 'Homepage Signup Conversions' )
           .test( 'Home V1' )
           .test( 'Home V2' )
           .go();

signup.on('click', function(){
    test.complete();
});
```

This results in the body tag being appended with a css class like the following:

```html
<body class="home-v1">
```

Alternatively, you can handle your test differences with JavaScript:

```javascript
var test = new Scenario( 'Homepage Signup Conversions' )
           .test( 'Home V1', function(){
               // Do something optional
           })
           .test( 'Home V2', function(){
               // Do something optional
           })
           .go();

signup.on('click', function(){
    test.complete();
});
```


Licensing
---------
MIT