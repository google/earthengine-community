# Landcover Toolkit Tests

While code describes _how_ a program should accomplish its task, tests describe
_what_ the code's behavior should be. They provide a strict written contract
that code must satisfy, as well as an indicator that code continues to work as
expected when it or its environment is modified.

The Landcover Toolkit tests are defined and run using the [Jasmine][jasmine]
framework. Specific usage and examples can be found on the Jasmine website.

Note: Some tests and utils in this package rely on a common testing technique
called _test doubles_ ([TotT: Know Your Test Doubles][tott-doubles]). Tests use
these only when necessary, instead preferring to rely on public APIs whenever
possible ([xUnit Patterns Principle: Use the Front Door
First][front-door-first]).

## Unit tests

Unit tests verify whether individual pieces of a program are fit for use; their
goal is to show that each piece of code works in relative isolation, and
continues to do so when code is changed. They are generally small enough to be
easily understood by other developers, fast to run, and robust enough that
changes to unrelated code will have no effect on their outcome, making it easy
to identify and fix the cause of failures.

Landcover Toolkit unit tests reside in `test/unit/filename.unit.test.js`, where
`filename` represents the file under test. They can be run with:

    $ npm run test:unit

<!--
  TODO(gino-m): Once CI is set up, describe relationship to tests.
-->

### Offline stub

On initialization, the Earth Engine API normally fetches the list of available
operations from the server. Since unit tests run independently offline, unit
tests mock out calls to the server, returning instead the response cached in
`unit/algorithms.json`. To update this file after new functionality has been
added to Earth Engine, when online simply run:

    $ npm run update-algorithms

### Why test interactions?

As discussed in [TotT: Testing State vs. Testing Interactions][tott-state-vs],
we generally prefer to test the result of a particular operation or its final
state over inspecting interactions with other libraries (e.g., testing the
result of filtering an `ImageCollection`, not that `updateMask()` was called
with specific parameters). Directly testing that specific Earth Engine API
methods are called is also a clear contradiction of testing behavior over
implementation ([TotT: Test Behavior, Not Implementation][tott-test-behavior]).
Why, then, do we test interactions instead of state?

As you may recall, the Earth Engine API doesn't actually do the heavy lifting of
calculating results. Instead, it builds up an execution graph that essentially
mirrors clients' calls to the API. This graph is then sent to the server for
execution. For this reason, attempting to check the state of the resulting
objects offline will effectively require our tests to contain a mirror image
of the actual code under test. These types of tests are fragile and don't catch
actual defects, as is thoughtfully described in [TotT: Change-Detector Tests
Considered Harmful][tott-change-detector].

Another way to think of it is that the Toolkit is fit for purpose when it calls
the Earth Engine API on our behalf as expected. How the Earth Engine API stores
state internally, builds up server requests, and communicates with the server is
irrelevant from the perspective of the Toolkit. In that sense, by testing the
Toolkit's usage of the Earth Engine API, we're effectively testing its behavior.

## End-to-end integration tests

Sometimes referred to as just _end-to-end (E2E) tests_, these tests verify code
works as expected in context, in this case against a live server. Since
these tests run against the live Earth Engine server, they require a private key
associated with an Earth Engine service account as described in
[CONTRIBUTING.md](../CONTRIBUTING.md#testing).

Rather than check results returned by Earth Engine against "golden copies" which
could easily become stale, we instead select return values that are unlikely to
change, and that demonstrate that the code under test is behaving as expected.

Integration tests are defined in `test/int/filename.int.test.js`, where
`filename` represents the file under test. Since integration tests are run
against the live server, they take more time to run. They can be run
independently from unit tests with:

    $ npm run test:int

[front-door-first]: http://xunitpatterns.com/Principles%20of%20Test%20Automation.html#Use%20the%20Front%20Door%20First
[jasmine]: https://jasmine.github.io/
[tott-change-detector]: https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html
[tott-doubles]: https://testing.googleblog.com/2013/07/testing-on-toilet-know-your-test-doubles.html
[tott-state-vs]: https://testing.googleblog.com/2013/03/testing-on-toilet-testing-state-vs.html
[tott-test-behavior]: https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html
