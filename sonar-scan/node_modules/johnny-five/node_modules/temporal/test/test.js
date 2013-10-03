"use strict";

var temporal = require("../lib/temporal.js");


function sum( a, b ) {
  return a + b;
}

function fuzzy( actual, expected, tolerance ) {
  var diff;

  tolerance = tolerance === undefined ? 10 : tolerance;

  if ( actual === expected ) {
    return true;
  }
  diff = fuzzy.lastDiff = Math.abs( actual - expected );

  if ( diff <= tolerance ) {
    return true;
  }
  return false;
}

fuzzy.lastDiff = 0;



exports[ "context" ] = {
  setUp: function( done ) {
    done();
  },
  loop: function( test ) {
    test.expect(1);

    temporal.loop( 200, function( context ) {
      console.log( context );

      test.ok( context === this );

      if ( context.called === 1 ) {
        this.stop();
        test.done();
      }
    });
  }
};


exports[ "loops" ] = {
  setUp: function( done ) {
    done();
  },
  stop: function( test ) {
    test.expect(1);

    var temporaldAt, completeds, last;

    temporaldAt = Date.now();

    completeds = [];

    temporal.loop( 100, function( loop ) {
      // console.log( "a", a );
      if ( loop.called === 1 ) {
        completeds.push( loop.called );
        this.stop();
      }
    });

    temporal.loop( 100, function( loop ) {
      // console.log( "b", b );
      if ( loop.called === 3 ) {
        completeds.push( loop.called );
        this.stop();
      }
    });

    last = temporal.loop( 100, function( loop ) {
      // console.log( "c", c );
      if ( loop.called === 5 ) {
        completeds.push( loop.called );
        loop.stop();
      }
    });


    last.on("stop", function() {
      var result = completeds.reduce( sum, 0 );

      test.equal( result, 9, "sum of loop.called counters is 9" );
      test.done();
    });
  }
};



exports[ "delay" ] = {
  setUp: function( done ) {
    done();
  },
  delay: function( test ) {
    test.expect(7);

    var completed, times;

    completed = 0;

    times = [
      10, 100, 150, 500, 750, 1000, 3000
    ];

    times.forEach(function( time ) {

      var temporaldAt = Date.now(),
          expectAt = temporaldAt + time;

      temporal.delay( time, function() {
        var actual = Date.now();

        test.ok(
          fuzzy( actual, expectAt ),
          "time: " + time + " ( " + Math.abs( actual - expectAt ) + ")"
        );

        if ( ++completed === times.length ) {
          test.done();
        }
        console.log( completed, time );
      });
    });
  }
};


exports[ "queue" ] = {
  setUp: function( done ) {
    done();
  },
  delay: function( test ) {
    test.expect(3);

    var temporaldAt = Date.now(),
        expectAt = temporaldAt + 100;

    // Wait queue
    temporal.queue([
      {
        delay: 100,
        task: function() {
          var now = Date.now();

          test.ok( fuzzy(now, expectAt, 1), "queued fn 1: on time" );
          expectAt = now + 200;
        }
      },
      {
        delay: 200,
        task: function() {
          var now = Date.now();

          test.ok( fuzzy(now, expectAt, 1), "queued fn 2: on time" );
          test.ok( fuzzy(now, temporaldAt + 300, 1), "queue lapse correct" );

          test.done();
        }
      }
    ]);
  },
  loop: function( test ) {
    test.expect(6);

    var temporaldAt = Date.now(),
        expectAt = temporaldAt + 100;

    // Wait queue
    temporal.queue([
      {
        delay: 100,
        task: function() {
          var now = Date.now();

          test.ok( fuzzy(now, expectAt, 1), "queued delay fn 1: on time" );
          expectAt = now + 200;
        }
      },
      {
        loop: 200,
        task: function( task ) {
          var now = Date.now();

          if ( task.called === 1 ) {
            test.ok( fuzzy(now, expectAt, 1), "queued loop fn 1: on time" );
            test.ok( fuzzy(now, temporaldAt + 300, 1), "queue lapse correct" );
          }

          if ( task.called === 2 ) {
            test.ok( "stop" in task );
            test.ok( fuzzy(now, expectAt, 1), "queued loop fn 2: on time" );
            test.ok( fuzzy(now, temporaldAt + 500, 1), "queue lapse correct" );
            test.done();
          }

          expectAt = now + 200;
        }
      }
    ]);
  },
  ended: function( test ) {
    test.expect(3);

    var queue;

    // Wait queue
    queue = temporal.queue([
      {
        delay: 100,
        task: function() {
          test.ok( true );
        }
      },
      {
        delay: 100,
        task: function() {
          test.ok( true );
        }
      }
    ]);

    queue.on("ended", function() {
      test.ok( true );
      test.done();
    });
  }
};


Object.keys(exports).forEach(function( exp ) {
  var setUp = exports[ exp ].setUp;
  exports[ exp ].setUp = function( done ) {
    console.log( "\n" );
    setUp( done );
  };
});






/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
