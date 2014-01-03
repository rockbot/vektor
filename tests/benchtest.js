//example benchmarking exercise using benchmark (npm install benchmark)

var Benchmark = require('benchmark');
var Matrix = require('../').matrix;

var suite = new Benchmark.Suite;

// add tests
suite.add('cofactor det', function() {
      var A = new Matrix(5, 5);
      A.setRow(0, [1,2,5,4,3]);
      A.setRow(1, [2,3,5,5,2]);
      A.setRow(2, [2,2,5,6,1]);
      A.setRow(3, [0,-2,1,3,2]);
      A.setRow(4, [1,2,0,5,4]);

      var determinant = A.cofactorDet();
})
.add('doolittle det', function(){
      var A = new Matrix(5, 5);
      A.setRow(0, [1,2,5,4,3]);
      A.setRow(1, [2,3,5,5,2]);
      A.setRow(2, [2,2,5,6,1]);
      A.setRow(3, [0,-2,1,3,2]);
      A.setRow(4, [1,2,0,5,4]);

      var determinant = A.det();	
})

// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
