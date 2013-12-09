vektor
---
A robotics-focused linear algebra module

### About
This code was officially presented at JSConf US 2013. There are slides from the talk here: [AI.js: Robots with Brains](https://t.co/6A5cu2JF58)

### Install
`npm install vektor`

### Vectors

#### initializing a vector
```` js
var v = require('vektor').vector;

var a = new v(1, 0, 0);
// or
var b = new v({x: 1, y: 2, z: 3});
````

Note: Vectors can be initialized with 2 or 3 arguments only.

#### add two vectors
```` js
var c = a.add(b); // [2, 2, 3]
````

#### dot product
```` js
var c = a.dot(b); // 1
````

#### cross product
```` js
var c = a.cross(b); // [0, -3, 2]
````

#### distance between two vectors
```` js
var c = a.distanceFrom(b); // 3.6
````

#### length
```` js
var c = b.length(); // 3.74
````

### Matrices
* set
* get
* add
* dot (multiply)
* transpose

### Homogenous Matrices (aka Transforms)
* Rotations
* Translations

### Examples
* Manipulator

### Coming Soon
* Tutorials :-)

### Contributions
_Please, please, please help make this module more robust!_

* Send in pull requests (make sure the tests pass)
* Discuss additional features in the Issues section
* Add your name and Github handle here:
    * Rick Waldron - [rwldrn](https://github.com/rwldrn)
    * Forbes Lindsay - [ForbesLindesay](https://github.com/ForbesLindesay)
