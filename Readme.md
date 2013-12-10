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

-----

### Matrices

#### initializing a matrix
Note: matrices can be of any size

```` js
var m = require('vektor').matrix;

var A = new m(2); // a 2x2 empty matrix
var B = new m(2, 3); // a 2x3 empty matrix
var I_3 = new m(3, 3, true); // a 3x3 identity matrix
````

#### setting values
```` js
/* our matrices:

    A = [ [1, 2],
          [3, 4] ];

    B = [ [5, 6],
          [7, 8] ];
*/

A.set(0,0,1);
A.set(0,1,2);
A.set(1,0,3);
A.set(1,1,4);

B.set(0,0,5);
B.set(0,1,6);
B.set(1,0,7);
B.set(1,1,8);
````

#### getting values
```` js
var c = A.get(1,1); // 4
````

#### scaling a matrix
```` js
var C = A.scale(-1); // A = [ [-1, -2], [-3, -4] ]
````

#### adding two matrices
```` js
var C = A.add(B); // C = [ [6, 8], [10, 12] ]
````

#### multiplying two matrices
```` js
var C = A.dot(B); // C = [ [19, 22], [43, 50] ]
````

#### getting the transpose
```` js
var C = A.transpose(); // C = [ [1, 3], [2, 4] ]
````

#### calculating the determinant
```` js
var c = A.det(); // c = -2
````

#### calculating the trace
Note: only works with square matrices... for now.
```` js
var c = A.trace(); // c = 5
````

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
