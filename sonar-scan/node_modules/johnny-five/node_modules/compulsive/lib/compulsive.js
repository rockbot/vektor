/*
* compulsive
* https://github.com/rwldrn/compulsive
*
* Copyright (c) 2012 Rick Waldron
* Licensed under the MIT license.
*/
var events = require("events"),
    util = require("util"),
    exp, queue, seen, last, offset;

exp = {};

// Object containing callback queues by time-to-execute
queue = {};

// List of times that have already been seen
seen = [];

// Initial value of offset
offset = 10;

setImmediate(function tick() {
  setImmediate( tick );

  var now, entry, entries, later;

  // Store entry stack key
  now = Date.now();

  // Derive entries stack from queue
  entries = queue[ now ] || [];

  // Enter the queue execution mode only if there is
  // an actual stack to operate on
  if ( entries.length > 0 ) {

    while ( entries.length ) {
      // Shift the entry out of the current list
      entry = entries.shift();


      // Execute the entry's callback, with entry as |this| and first arg
      entry.fn( entry );

      // Additional handling for "loop" and "repeat"
      if ( entry.type !== "wait" && entry.isRunnable ) {

        // Calculate the next execution time
        entry.later = now + entry.ms;

        // Create a queue entry if none exists
        if ( !queue[ entry.later ] ) {
          queue[ entry.later ] = [];
        }


        if ( entry.type === "repeat" && --entry.repeat < 0 ) {
          entry.isRunnable = false;
        }

        if ( entry.isRunnable ) {
          // Push the entry into the cue
          queue[ entry.later ].push( entry );
        }
      }
    }

    seen.push( now );

    // Delete the empty queue array
    delete queue[ now ];
  }
});

/**
 * Schedule create a schedule item
 * @param {Number} ms    Time in ms
 * @param {Object} entry Options for entry
 */
function Schedule( ms, entry ) {
  if ( !(this instanceof Schedule) )  {
    return new Schedule( ms, entry );
  }

  this.ms = ms;
  this.now = Date.now();
  // this.later = (this.now + ms) - offset;

  this.later = this.now + ms;
  this.type = entry.type;
  this.fn = entry.fn;
  this.isRunnable = true;
  this.repeat = entry.repeat;

  if ( !queue[ this.later ] ) {
    queue[ this.later ] = [];
  }

  queue[ this.later ].push( this );
}

// Inherit EventEmitter API
util.inherits( Schedule, events.EventEmitter );

/**
 * stop Stop the current behaviour
 */
Schedule.prototype.stop = function() {
  this.isRunnable = false;
  this.emit("stop");
};



[ "loop", "wait" ].forEach(function( type ) {

  exp[ type ] = function( ms, callback ) {

    if ( typeof ms === "function" ) {
      callback = ms;
      ms = 1;
    }

    return new Schedule( ms, {
      type: type,
      fn: callback,
      repeat: null
    });
  };
});


exp.repeat = function( repeat, ms, callback ) {
  return new Schedule( ms, {
    type: "repeat",
    fn: callback,
    repeat: repeat
  });
};


exp.queue = function( context, tasks ) {
  var task, op, cumulative, item;

  if ( typeof tasks === "undefined" ) {
    tasks = context;
    context = null;
  }

  cumulative = 0;

  while ( tasks.length ) {
    item = tasks.shift();
    op = Object.keys(item).reduce(function( p, v ) {
      return v !== "task" ? v : p;
    }, "");

    cumulative += item[ op ];
    task = item.task;

    if ( tasks.length === 0 ) {
      task = function( controller ) {
        item.task.call( context || controller, controller );
        controller.emit("end");
      };
    }

    if ( context ) {
      task = task.bind( context );
    }

    if ( op === "loop" ) {
      // When shifting from a wait to a loop, allow
      // the loop to iterate the amount of time given,
      // but still start at the correct offset.
      exp.wait( cumulative - item[ op ], function() {
        exp.loop( item[ op ], task );
      });
    } else {
      exp[ op ]( cumulative, task );
    }
  }
};


// Run with:
// `node lib/compulsive.js assert`
//
// var startedAt, expectAt, lastAt, counters, repeated;

// if ( process.argv.length === 3 && process.argv[2] === "assert" ) {


//   counters = {};
//   startedAt = Date.now();

//   [
//     0, 100, 500,
//     1000, 1000, 1000, 1000, 1000, 1000, 1000,
//     1250
//   ].forEach(function( time, k, arr ) {
//     var calledAt = Date.now(),
//         expectAt = calledAt + time;

//     exp.wait( time, function() {
//       var now = Date.now();

//       console.log( "Elapsed Since Start:", now - startedAt );
//       console.log( now === expectAt, expectAt - now  );

//       if ( k === arr.length - 1 ) {
//         console.log({
//           "expected end": startedAt + 1250,
//           "actual end": now,
//           "difference": now - (startedAt + 1250)
//         });
//       }
//     });
//   });

//   counters.loop = 0;

//   startedAt = Date.now();
//   expectAt = startedAt + 100;

//   exp.loop( 100, function( control ) {
//     var now = Date.now();

//     console.log( "Elapsed Since Start:", now - startedAt );
//     console.log( now === expectAt, expectAt - now  );


//     expectAt = now + 100;

//     if ( ++counters.loop === 10 ) {
//       this.stop();

//       console.log({
//         "expected end": startedAt + 1000,
//         "actual end": now,
//         "difference": now - (startedAt + 1000)
//       });
//     }
//   });



//   counters.repeat = 0;
//   startedAt = Date.now();
//   expectAt = startedAt + 100;


//   exp.repeat( 5, 100, function() {
//     var now = Date.now();

//     console.log( "Elapsed Since Start:", now - startedAt );
//     console.log( now === expectAt, expectAt - now  );

//     expectAt = now + 100;

//     if ( ++counters.repeat === 5 ) {
//       console.log({
//         "expected end": startedAt + 1000,
//         "actual end": now,
//         "difference": now - (startedAt + 1000)
//       });
//     }
//   });

// }

module.exports = exp;
