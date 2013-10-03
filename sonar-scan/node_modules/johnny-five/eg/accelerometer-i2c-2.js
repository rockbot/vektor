// var Emitter = require("events").EventEmitter,
//   five = require("../lib/johnny-five.js"),
//   board, accel;

// board = new five.Board();

// board.on("ready", function () {
//   var firmata = this.firmata;

//   firmata.sendI2CConfig(1000);
//   // firmata.on("string", function( string ) {
//   //   console.log( string );
//   // });


//   // 2, 4, or 8g
//   var GSCALE = 2;
//   var emitter = new Emitter();


//   firmata.write = function (bytes) {
//     // bytes: [ address, [register, ...data] ]
//     // bytes: [ address, [...data] ]

//     var data = [0xF0, 0x76];

//     // address, mode
//     data.push(bytes.shift(), 0x00 << 3);

//     // ...data
//     for (var i = 0, len = bytes.length; i < len; i++) {
//       data.push(
//         bytes[i] & 0x7F, (bytes[i] >> 7) & 0x7F
//       );
//     }

//     data.push(0xF7);

//     firmata.sp.write(data);
//   };


//   firmata.read = function (bytes, callback) {
//     // bytes: [ address, [register], numBytes ]
//     // bytes: [ address, numBytes ]

//     var data = [0xF0, 0x76],
//       address, register, numBytes;

//     address = bytes.shift();

//     // address, mode
//     data.push(address, 0x01 << 3);

//     // register
//     if (bytes.length === 2) {
//       register = bytes.shift();

//       data.push(
//         register & 0x7F, (register >> 7) & 0x7F
//       );
//     }

//     // number of bytes to read
//     numBytes = bytes.shift();

//     data.push(
//       numBytes & 0x7F, (numBytes >> 7) & 0x7F
//     );

//     data.push(0xF7);

//     firmata.sp.write(data);

//     firmata.once('I2C-reply-' + address + '-' + register, callback);
//   };

//   // 240, 118, 29, 8, 13, 0, 1, 0, 247

//   function active() {
//     firmata.read([0x1D, 0x2A, 1], function (data) {
//       firmata.write([0x1D, 0x2A, data[0] | 0x01]);
//     });
//   }

//   function scale() {
//     var fsr = GSCALE;

//     if (fsr > 8) {
//       fsr = 8;
//     }

//     firmata.write([0x1D, 0x0E, fsr >>= 2]);
//   }

//   function standby(callback) {
//     firmata.read([0x1D, 0x2A, 1], function (data) {
//       var byt = data[0];

//       firmata.write([0x1D, 0x2A, byt & ~(0x01)]);

//       callback();
//     });
//   }

//   function initialize(handler) {
//     firmata.read([0x1D, 0x0D, 1], function (data) {
//       var byt = data[0];

//       if (byt !== 0x2A) {
//         setTimeout(initialize, 500);
//       } else {
//         standby(function () {
//           scale();
//           active();
//           handler();
//         });
//       }
//     });
//   }

//   function Axes(x, y, z) {
//     this.x = x || 0;
//     this.y = y || 0;
//     this.z = z || 0;
//   }

//   initialize(function () {
//     var axes = ["x", "y", "z"];

//     function readAccelData() {
//       var ax = new Axes();

//       firmata.read([0x1D, 0x01, 6], function (data) {
//         var gCount;

//         for (var i = 0; i < 3; i++) {
//           gCount = (data[i * 2] << 8) | data[(i * 2) + 1];
//           gCount >>= 4;

//           // if (data[i * 2] > 0x7F) {
//           //   gCount = ~gCount + 1;
//           //   gCount *= -1;
//           // }

//           ax[axes[i]] = gCount;

//           emitter.emit("acceleration", ax);
//         }
//       });
//     }

//     setInterval(readAccelData, 500);
//   });

//   emitter.on("acceleration", function (data) {
//     console.log(data);
//   })


//   // static inline void registerWrite(addr, value) {
//   //   Wire.beginTransmission(ADDRESS);
//   //   Wire.write(addr);
//   //   Wire.write(value);
//   //   Wire.endTransmission();
//   // }

//   // static inline void registersWrite(addr, data[], size_t count) {
//   //   Wire.beginTransmission(ADDRESS);
//   //   Wire.write(addr);

//   //   for (int i = 0; i < count; i++)
//   //     Wire.write(data[i]);

//   //   Wire.endTransmission();
//   // }

//   // static inline void registerSetBit(addr, bit, bool value) {
//   //   val = registerRead(addr);
//   //   bitWrite(val, bit, value);
//   //   registerWrite(addr, val);
//   // }

//   // MMA8452Q::MMA8452Q() {
//   // }

//   // firmata.read()

//   // function begin() {
//   //   whoami = registerRead(WHO_AM_I);

//   //   if (whoami != 0x2A)
//   //     return -1;

//   //   this -> active(true);

//   //   return 0;
//   // }

//   // MMA8452Q::status(void) {
//   //   return registerRead(STATUS);
//   // }

//   // MMA8452Q::sysmod(void) {
//   //   return registerRead(SYSMOD);
//   // }

//   // MMA8452Q::intSource(void) {
//   //   return registerRead(INT_SOURCE);
//   // }

//   // void MMA8452Q::scale(scale) {
//   //   value = registerRead(XYZ_DATA_CFG);

//   //   switch (scale) {
//   //     case 2: bitWrite(value, 0, 0); bitWrite(value, 1, 0); break;
//   //     case 4: bitWrite(value, 0, 1); bitWrite(value, 1, 0); break;
//   //     case 8: bitWrite(value, 0, 0); bitWrite(value, 1, 1); break;
//   //   }
//   // }

//   // void MMA8452Q::offset(int8_t off_x, int8_t off_y, int8_t off_z) {
//   //   registerWrite(OFF_X, off_x);
//   //   registerWrite(OFF_Y, off_y);
//   //   registerWrite(OFF_Z, off_z);
//   // }

//   // void MMA8452Q::active(bool enable) {
//   //   registerSetBit(CTRL_REG1, ACTIVE, enable);
//   // }

//   // void MMA8452Q::fastRead(bool enable) {
//   //   registerSetBit(CTRL_REG1, F_READ, enable);
//   // }

//   // void MMA8452Q::lowNoise(bool enable) {
//   //   registerSetBit(CTRL_REG1, LNOISE, enable);
//   // }

//   // void MMA8452Q::reset(void) {
//   //   registerSetBit(CTRL_REG2, RST, 1);
//   // }

//   // void MMA8452Q::selfTest(bool enable) {
//   //   registerSetBit(CTRL_REG2, ST, enable);
//   // }

//   // void MMA8452Q::autoSleep(bool enable) {
//   //   registerSetBit(CTRL_REG2, SLPE, enable);
//   // }

//   // void MMA8452Q::detectOrientation(bool enable) {
//   //   registerSetBit(PL_CFG, PL_EN, enable);
//   // }

//   // void MMA8452Q::wakeOn(bool enable, events) {
//   //   if (events & FREEFALL_MOTION)
//   //     registerSetBit(CTRL_REG3, WAKE_FF_MT, enable);

//   //   if (events & PULSE)
//   //     registerSetBit(CTRL_REG3, WAKE_PULSE, enable);

//   //   if (events & ORIENTATION)
//   //     registerSetBit(CTRL_REG3, WAKE_LNDPRT, enable);
//   // }

//   // /* void MMA8452Q::intDataRdy(bool enable, pin) { */
//   // /*  registerSetBit(CTRL_REG4, INT_EN_DRDY, enable); */
//   // /*  registerSetBit(CTRL_REG5, INT_CFG_DRDY, enable); */
//   // /* } */

//   // /* void MMA8452Q::intFreefallMotion(bool enable, pin) { */
//   // /*  registerSetBit(CTRL_REG4, INT_EN_FF_MT, enable); */
//   // /*  registerSetBit(CTRL_REG5, INT_CFG_FF_MT, enable); */
//   // /* } */

//   // /* void MMA8452Q::intPulse(bool enable, pin) { */
//   // /*  registerSetBit(CTRL_REG4, INT_EN_PULSE, enable); */
//   // /*  registerSetBit(CTRL_REG5, INT_CFG_PULSE, enable); */
//   // /* } */

//   // /* void MMA8452Q::intOrientation(bool enable, pin) { */
//   // /*  registerSetBit(CTRL_REG4, INT_EN_LNDPRT, enable); */
//   // /*  registerSetBit(CTRL_REG5, INT_CFG_LNDPRT, enable); */
//   // /* } */

//   // /* void MMA8452Q::intAutoSlp(bool enable, pin) { */
//   // /*  registerSetBit(CTRL_REG4, INT_EN_ASLP, enable); */
//   // /*  registerSetBit(CTRL_REG5, INT_CFG_ASLP, enable); */
//   // /* } */

//   // void MMA8452Q::axes(int axes[]) {
//   //   *data;
//   //   read_count = 0;
//   //   val = registerRead(CTRL_REG1);

//   //   if (bitRead(val, F_READ) == 0)
//   //     read_count = 6;
//   //   else
//   //     read_count = 3;

//   //   data = new uint8_t[read_count];

//   //   registersRead(OUT_X_MSB, data, read_count);

//   //   for (int i = 0; i < 3; i++) {
//   //     axes[i]  = data[i * (read_count / 3)] << 8;

//   //     if (bitRead(val, F_READ) == 0)
//   //       axes[i] |= data[(i * 2) + 1];

//   //     axes[i] >>= 4;
//   //   }

//   //   delete[] data;
//   // }

//   // bool MMA8452Q::orientation(*value) {
//   //   *value = registerRead(PL_STATUS);
//   //   return bitRead(*value, NEWLP);
//   // }

//   // int MMA8452Q::portrait(orient) {
//   //   if ((bitRead(orient, LAPO1) == 0) && (bitRead(orient, LAPO0) == 0))
//   //     return HIGH;
//   //   else if ((bitRead(orient, LAPO1) == 0) && (bitRead(orient, LAPO0) == 1))
//   //     return LOW;
//   //   else
//   //     return -1;
//   // }

//   // int MMA8452Q::landscape(orient) {
//   //   if ((bitRead(orient, LAPO1) == 1) && (bitRead(orient, LAPO0) == 0))
//   //     return HIGH;
//   //   else if ((bitRead(orient, LAPO1) == 1) && (bitRead(orient, LAPO0) == 1))
//   //     return LOW;
//   //   else
//   //     return -1;
//   // }

//   // int MMA8452Q::backFront(orient) {
//   //   return bitRead(orient, BAFRO);
//   // }
// });
