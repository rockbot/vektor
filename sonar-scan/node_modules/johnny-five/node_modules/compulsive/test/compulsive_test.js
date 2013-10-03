var compulsive = require("../lib/compulsive.js"),
    events = require("events"),
    util = require("util");


// console.log( compulsive );
function fuzzy(actual, expected, allow) {
  var high, low;
  high = expected + allow;
  low = expected - allow;

  if ( actual >= low && actual <= high ) {
    return true;
  }
  return false;
}


[
  [ 1000, 1000, 1000, 1000, 1000, 1000, 1000 ],
  [ 0, 100, 500, 1000, 1250, 1500, 2000, 5000 ]
].forEach(function( times, i ) {

  var key = "compulsive.wait " + i;

  exports[ key ] = {
    setUp: function( done ) {
      done();
    }
  };


  times.forEach(function( time, k ) {

    var title = time + ", " + k;

    exports[ key ][ title ] = function( test ) {
      test.expect(1);

      var calledAt = Date.now(),
          expectAt = calledAt + time;

      compulsive.wait( time, function() {
        test.equal( Date.now(), expectAt, title );
        test.done();
      });
    };
  });
});


exports[ "compulsive.loop" ] = {
  setUp: function( done ) {
    done();
  },
  loop: function( test ) {
    test.expect(5);

    var calledAt = Date.now(),
        expectAt = Date.now() + 100,
        counter = 0;



    compulsive.loop( 100, function() {
      test.equal( Date.now(), expectAt );


      expectAt = Date.now() + 100;

      if ( ++counter === 5 ) {
        this.stop();

        test.done();
      }
    });
  },
  stop: function( test ) {
    test.expect(1);

    var a = 0, b = 0, c = 0;

    compulsive.loop( 100, function() {
      // console.log( "a", a );
      if ( ++a === 1 ) {
        this.stop();
      }
    });

    compulsive.loop( 100, function() {
      // console.log( "b", b );
      if ( ++b === 3 ) {
        this.stop();
      }
    });

    compulsive.loop( 100, function( loop ) {
      // console.log( "c", c );
      if ( ++c === 5 ) {
        loop.stop();
      }
    });

    compulsive.wait( 1000, function() {

      var result = [ a, b, c ].reduce(function( p, v ) {
        return p + v;
      }, 0);

      test.equal( result, 9, "sum of a, b, c counters is 9" );
      test.done();
    });
  }
};


exports[ "compulsive.repeat" ] = {
  setUp: function( done ) {
    done();
  },
  repeat: function( test ) {
    test.expect(6);

    var calledAt = Date.now(),
        expectAt = Date.now() + 100,
        counter = 0;

    compulsive.repeat( 5, 100, function() {
      var now = Date.now();

      test.equal( now, expectAt, "counter " + counter  );

      expectAt = now + 100;

      if ( ++counter === 5 ) {
        test.ok( true, "repeat last" );
        test.done();
      }
    });
  }
};


exports[ "compulsive.queue:wait" ] = {
  setUp: function( done ) {
    done();
  },
  wait: function( test ) {
    test.expect(3);

    var calledAt = Date.now(),
        expectAt = calledAt + 100,
        counter = 0;

    // Wait queue
    compulsive.queue([
      {
        wait: 100,
        task: function() {
          var now = Date.now();

          test.ok( fuzzy(now, expectAt, 1), "queued fn 1: on time (within 1ms)" );
          expectAt = now + 200;
        }
      },
      {
        wait: 200,
        task: function( task ) {
          var now = Date.now();

          test.ok( fuzzy(now, expectAt, 1), "queued fn 2: on time (within 1ms)" );
          test.ok( fuzzy(now, calledAt + 300, 1), "queue lapse correct (within 1ms)");

          test.done();
        }
      }
    ]);
  },
  loop: function( test ) {
    test.expect(6);

    var calledAt = Date.now(),
        expectAt = calledAt + 100,
        counter = 0;

    // Wait queue
    compulsive.queue([
      {
        wait: 100,
        task: function() {
          var now = Date.now();

          test.equal( now, expectAt, "queued wait fn 1: on time" );
          expectAt = now + 200;

          counter++;
        }
      },
      {
        loop: 200,
        task: function( task ) {
          var now = Date.now();

          if ( counter === 1 ) {
            test.equal( now, expectAt, "queued loop fn 1: on time" );
            test.equal( now, calledAt + 300, "queue lapse correct" );
          }

          if ( counter === 2 ) {
            test.ok( "stop" in task );
            test.equal( now, expectAt, "queued loop fn 2: on time" );
            test.equal( now, calledAt + 500, "queue lapse correct" );
            test.done();
          }

          expectAt = now + 200;
          counter++;
        }
      }
    ]);
  },
  end: function( test ) {
    test.expect(5);

    var counter = 0;

    // Wait queue
    compulsive.queue([
      {
        wait: 10,
        task: function() {
          counter++;
          test.ok( true );
        }
      },
      {
        wait: 10,
        task: function() {
          counter++;
          test.ok( true );
        }
      },
      {
        wait: 10,
        task: function() {
          counter++;
          test.ok( true );
        }
      },
      {
        wait: 100,
        task: function( task ) {

          task.on("end", function() {
            test.ok( true, "Task end event fired" );
            test.equal( counter, 3, "counter equals 3" );
            test.done();
          });
        }
      }
    ]);
  }
};

exports[ "compulsive.queue w/ context" ] = {
  setUp: function( done ) {
    done();
  },
  contextwait: function( test ) {
    test.expect(2);

    function C() {}
    util.inherits( C, events.EventEmitter );

    var calledAt = Date.now(),
        expectAt = calledAt + 100,
        counter = 0,
        context = new C();

    context.once("waitover", function( o ) {
      test.ok( o instanceof C, "correct wait context, 2" );
      test.done();
    });

    // Wait queue
    compulsive.queue( context, [
      {
        wait: 100,
        task: function() {
          test.ok( this instanceof C, "correct wait context, 1" );
        }
      },
      {
        wait: 100,
        task: function() {
          this.emit("waitover", this);
        }
      }
    ]);
  },
  contextloop: function( test ) {
    test.expect(2);

    function C() {}
    util.inherits( C, events.EventEmitter );

    var calledAt = Date.now(),
        expectAt = calledAt + 100,
        counter = 0,
        context = new C();

    context.once("loopstop", function( o ) {
      test.ok( o instanceof C, "correct loop context, 2" );
      test.done();
    });

    // Wait queue
    compulsive.queue( context, [
      {
        wait: 100,
        task: function() {
          test.ok( this instanceof C, "correct wait context, 1" );
        }
      },
      {
        loop: 100,
        task: function( loop ) {
          if ( ++counter === 3 ) {
            this.emit("loopstop", this);
          }
        }
      }
    ]);
  }
};


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

// exports["api"] = {
//   setUp: function(done) {
//     // setup here
//     done();
//   },
//   "no args": function(test) {
//     test.expect(1);
//     // tests here
//     test.equal( typeof compulsive, "function", "should be awesome." );
//     test.done();
//   }
// };
