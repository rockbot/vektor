"use strict";
 /*
  * temporal
  * https://github.com/rwldrn/temporal
  *
  * Copyright (c) 2012 Rick Waldron
  * Licensed under the MIT license.
  */
var events = require("events"),
    util = require("util"),
    exportable, queue, drift, priv;

require("es6-collections");

// All APIs will be added to `exportable`, which is lastly
// assigned as the value of module.exports
exportable = {};

// Object containing callback queues, keys are time in MS
queue = {};

// Initial value of time drift
// TODO: Implement drift adjustment algorithm
drift = 0;

// Task details are stored as a plain object, privately in a WeakMap
// to avoid being forced to expose the properties directly on the instance.
//
// Queue emitters are stored privately in a WeakMap to avoid using
// |this| alias patterns.
priv = new WeakMap();

var setImmediate = global.setImmediate || process.nextTick;

/**
 * Task create a temporal task item
 * @param {Object} entry Options for entry {time, task}
 */
function Task( entry ) {
  if ( !(this instanceof Task) )  {
    return new Task( entry );
  }

  this.called = 0;
  this.now = this.calledAt = Date.now();

  priv.set( this, entry );

  // Side table property definitions
  entry.isRunnable = true;
  entry.later = this.now + entry.time;


  if ( !queue[ entry.later ] ) {
    queue[ entry.later ] = [];
  }

  // console.log( entry.later, this );
  queue[ entry.later ].push( this );
}

// Inherit EventEmitter API
util.inherits( Task, events.EventEmitter );

/**
 * Task.deriveOp (reduction)
 * (static)
 */
Task.deriveOp = function( p, v ) {
  return v !== "task" ? v : p;
};


/**
 * stop Stop the current behaviour
 */
Task.prototype.stop = function() {
  priv.get( this ).isRunnable = false;
  this.emit("stop");
};

function Queue( tasks ) {
  var op, cumulative, item, task;

  cumulative = 0;
  // Store |this| in the priv WeakMap to
  // avoid binding a context to the item.task
  // function expression—as user code may have already
  // done so.
  priv.set( tasks, this );

  while ( tasks.length ) {
    item = tasks.shift();
    op = Object.keys( item ).reduce( Task.deriveOp, "" );
    // console.log( op, item[ op ] );
    cumulative += item[ op ];

    // For the last task, ensure that an "ended" event is
    // emitted after the final callback is called.
    if ( tasks.length === 0 ) {
      task = item.task;
      item.task = function( temporald ) {
        task.call( this, temporald );

        // Emit the ended event _from_ within the _last_ task
        // defined in the Queue tasks. Use the |tasks| array
        // object as the access key.
        priv.get( tasks ).emit( "ended", temporald );
      };
    }

    if ( op === "loop" && tasks.length === 0 ) {
      // When transitioning from a "delay" to a "loop", allow
      // the loop to iterate the amount of time given,
      // but still start at the correct offset.
      exportable.delay( cumulative - item[ op ], function() {
        exportable.loop( item[ op ], item.task );
      });
    } else {
      // console.log( op, cumulative );
      exportable[ op ]( cumulative, item.task );
    }
  }
}

util.inherits( Queue, events.EventEmitter );

exportable.queue = function( tasks ) {
  return new Queue( tasks );
};


// For more information about this approach:
//
//    https://dl.dropbox.com/u/3531958/empirejs/index.html
//

setImmediate(function tick() {
  var now, entry, entries, temporald;

  // Store entry stack key
  now = Date.now();

  // Derive entries stack from queue
  entries = queue[ now ] || [];

  if ( entries.length ) {

    // console.log( now, entries );
    // console.log( entries );
    while ( entries.length ) {
      // Shift the entry out of the current list
      temporald = entries.shift();
      entry = priv.get( temporald );

      // Execute the entry's callback, with
      // "entry" as first arg
      if ( entry.isRunnable ) {
        temporald.called++;
        temporald.calledAt = now;
        entry.task.call( temporald, temporald );
      }

      // Additional "loop" handling
      if ( entry.type === "loop" && entry.isRunnable ) {

        // Calculate the next execution time
        entry.later = now + entry.time;

        // Create a queue entry if none exists
        if ( !queue[ entry.later ] ) {
          queue[ entry.later ] = [];
        }

        if ( entry.isRunnable ) {
          // Push the entry into the cue
          queue[ entry.later ].push( temporald );
        }
      }
    }

    // Delete the empty queue array
    delete queue[ now ];
  }

  setImmediate( tick );
});

[ "loop", "delay" ].forEach(function( type ) {
  exportable[ type ] = function( time, task ) {
    if ( typeof time === "function" ) {
      task = time;
      time = 10;
    }
    return new Task({
      time: time,
      type: type,
      task: task
    });
  };
});

// Alias "delay" as "wait" or "defer" (back compat with old compulsive API)
// These aid only in user code that desires clarity in purpose.
// Certain practical applications might be suited to
// "defer" or "wait" vs. "delay"
//
exportable.wait = exportable.defer = exportable.delay;

exportable.repeat = function( n, ms, callback ) {
  exportable.loop( ms, function( context ) {
    if ( context.called === n ) {
      this.stop();
    } else {
      callback( context );
    }
  });
};


module.exports = exportable;
