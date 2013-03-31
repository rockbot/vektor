// -----------------------------------------------------------
// visualizer.js - main code for visualizing hands
// Created by Raquel Vélez
//
// 30 Dec 2011 - Reviewing code for submission. For future
// development: fix bugs, implement inverse kinematic model
// for single-point drag of each finger (more human-like
// and intuitive than adjusting each individual joint)
//
// 12 Oct 2010 - Compiled all the individual files (math.js,
// setupHand.js, setupHandFunctions.js, visualizerFunctions.js)
// into one to facilitate moving to the server. It's not
// perfect, but it's cool!
// -----------------------------------------------------------

// -----------------------------------------------------------
// set the angles of each joint and global rotation (for testing)
// -----------------------------------------------------------
function setAngles()
{
  var thumb =  [0 * Math.PI/180, -30 * Math.PI/180, 10 * Math.PI/180, 10 * Math.PI/180];
  var index =  [0 * Math.PI/180, 0 * Math.PI/180, 10 * Math.PI/180, 10 * Math.PI/180];
  var middle = [0 * Math.PI/180, 0 * Math.PI/180, 10 * Math.PI/180, 10 * Math.PI/180];
  var ring =   [0 * Math.PI/180, 0 * Math.PI/180, 10 * Math.PI/180, 10 * Math.PI/180];
  var pinky =  [0 * Math.PI/180, 0 * Math.PI/180, 10 * Math.PI/180, 10 * Math.PI/180];

  var global = [0,0,Math.PI/2];

  return thumb.concat(index, middle, ring, pinky, global);
}

// -----------------------------------------------------------
// get angles from the hand (and the orientation), and whether the hand is left or right))
// -----------------------------------------------------------
function getAnglesDeg(fingers, globalRotationAngles)
{
  var angles = new Array();

  for (var f = 0; f < fingers.length; ++f)
  {
    for (var j = 0; j < fingers[f].jointAngles.length; ++j)
    {
      angles.push(Math.round(fingers[f].jointAngles[j] * 180 / Math.PI));
    }
  }

  for (var g = 0; g < globalRotationAngles.length; ++g)
  {
    angles.push(Math.round(globalRotationAngles[g] * 180 / Math.PI));
  }

  angles.push(fingers[0].isLeft);

  return angles;
}

// -----------------------------------------------------------
// get angles from the hand
// -----------------------------------------------------------
function getAnglesRad(fingers, globalRotationAngles)
{
  var angles = new Array();

  for (var f = 0; f < fingers.length; ++f)
  {
    for (var j = 0; j < fingers[f].jointAngles.length; ++j)
    {
      angles.push(fingers[f].jointAngles[j]);
    }
  }

  for (var g = 0; g < globalRotationAngles.length; ++g)
  {
    angles.push(globalRotationAngles[g]);
  }

  return angles;
}

// -----------------------------------------------------------
// create a gesture
// -----------------------------------------------------------
function startMove()
{
  // initialize the canvas and context writer
  var canvas = document.getElementById("canvas_new_gesture");
  var ctx = canvas.getContext("2d");

  // set up the guide coordinates
  var origin_guide = new Vector(380,380,0);
  guide_coords = createCoords(origin_guide, 15);

  // pre-define global yaw, pitch, roll, with rotations for isometric view
  var startGlobalZrotAng = 0;//Math.PI/15;
  var startGlobalYrotAng = -Math.PI/10;
  var startGlobalXrotAng = Math.PI/3;
  var globalRotationAngles = new Array(startGlobalZrotAng, startGlobalYrotAng, startGlobalXrotAng);

  // set up the hand
  var origin_palm = new Vector(185,185,0);

  var isLeft = false;
  var spacing = 30;
  var shrinkFactor = 1;
  var fingers = Hand(origin_palm, spacing, shrinkFactor, isLeft);

  applyRotToAllFingers(fingers, origin_palm, globalRotationAngles);

  // pre-rotate into isometric view
  var visGuideCoords = rotateCoords(guide_coords, globalRotationAngles);
  //var visPalm = rotatePalm(palm, origin_palm, globalRotationAngles);
  var visPalm = createPalm(fingers, origin_palm, globalRotationAngles);

  // draw the guide coordinates and the fingers into view
  redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);

// draw the origin of the entire hand
//   ctx.fillStyle = "rgb(200,200,100)";
//   ctx.fillRect(origin_palm.v[0]-3, origin_palm.v[1]-3, 6, 6);

  var reset = false;

  var moveHand_lr = false;
  var moveHand_ud = false;
  var movePoint = false;

  var selectedPointIndex = null;
  var selectedFinger = null;
  var mouseCoords = null;

//   document.getElementById('new_gesture_left_hand_button').onclick = function(event)
//   {
//     document.getElementById('new_gesture_left_hand_button').className='new_gesture_hand_button_selected';
//     document.getElementById('new_gesture_right_hand_button').className='new_gesture_hand_button';
//     globalRotationAngles = [globalRotationAngles[0], -globalRotationAngles[1], globalRotationAngles[2]];
//     fingers = switchHands(fingers, globalRotationAngles, origin_palm, spacing, shrinkFactor, 1); // 1 is left
//     visGuideCoords = rotateHand([0,0], guide_coords, fingers, origin_palm, globalRotationAngles, moveHand_lr, moveHand_ud);
//     visPalm = createPalm(fingers, origin_palm, globalRotationAngles);
//     redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
//   }
//
//   document.getElementById('new_gesture_right_hand_button').onclick = function(event)
//   {
//     document.getElementById('new_gesture_left_hand_button').className='new_gesture_hand_button';
//     document.getElementById('new_gesture_right_hand_button').className='new_gesture_hand_button_selected';
//     globalRotationAngles = [globalRotationAngles[0], -globalRotationAngles[1], globalRotationAngles[2]];
//     fingers = switchHands(fingers, globalRotationAngles, origin_palm, spacing, shrinkFactor, 0); // 0 is right
//     visGuideCoords = rotateHand([0,0], guide_coords, fingers, origin_palm, globalRotationAngles, moveHand_lr, moveHand_ud);
//     visPalm = createPalm(fingers, origin_palm, globalRotationAngles);
//     redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
//   }
//
//   document.getElementById('new_gesture_reset_button').onclick = function(event)
//   {
//     for (var f=0; f<fingers.length; ++f) {
//       fingers[f].reset();
//     }
//     applyRotToAllFingers(fingers, origin_palm, globalRotationAngles);
//
//     globalRotationAngles = [startGlobalZrotAng, startGlobalYrotAng, startGlobalXrotAng];
//     visGuideCoords = rotateHand([0,0], guide_coords, fingers, origin_palm, globalRotationAngles, moveHand_lr, moveHand_ud);
//
//     visPalm = createPalm(fingers, origin_palm, globalRotationAngles);
//     redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
//   }

  // when the mouse is clicked
  document.onmousedown = function(event)
  {
    mouseCoords = getMouseCoords(event);

    if (mouseCoords == null)
    {
      alert("Nothing!")
    }
    else
    {
      // if there's a click on the guide coords, reset to starting angles
      if (mouseCoords[0] > 370 && mouseCoords[1] < 400 &&
          mouseCoords[1] > 370 && mouseCoords[1] < 400)
      {
        reset = true;
      }
      // if dragging around in one of the guide boxes, move the hand
      else if (mouseCoords[0] > 0 && mouseCoords[0] < 370 &&
               mouseCoords[1] > 370 && mouseCoords[1] < 400)
      {
        moveHand_lr = true;
      }
      else if (mouseCoords[0] > 370 && mouseCoords[0] < 400 &&
               mouseCoords[1] > 0 && mouseCoords[1] < 370)
      {
        moveHand_ud = true;
      }

      else
      {
        // if dragging one of the points, move the point around
        // the appropriate joint
        for (var fingNum = 0; fingNum < fingers.length; ++fingNum)
        {
          for (var ip = 0; ip < fingers[fingNum].visPoints.length; ++ip)
          {
            var radiusAroundPoints = 10;

            if (fingers[fingNum].visPoints[ip].withinRadiusAroundPoint(radiusAroundPoints, mouseCoords))
            {
              // set current point for dragging
              movePoint = true;
              selectedPointIndex = ip;
              selectedFinger = fingers[fingNum];
            } // if
          } // for ip
        } // for fingerNumber
      } // else
    }
  }

  // when the mouse is being dragged around
  document.onmousemove = function(event)
  {
    var newMouseCoords = getMouseCoords(event);

    if (newMouseCoords == null)
    {
      alert("Nothing!")
    }
    else
    {
      // determine the direction of the mouse movement
      if (mouseCoords != null)
        var diff = [ newMouseCoords[0] - mouseCoords[0], newMouseCoords[1] - mouseCoords[1] ];

      // move a selected point and the corresponding joints along the finger
      if (movePoint)
      {
        moveFinger(ctx, mouseCoords, newMouseCoords, selectedFinger, selectedPointIndex, origin_palm, globalRotationAngles, visGuideCoords);
        visPalm = createPalm(fingers, origin_palm, globalRotationAngles);
        redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
      }

      // move the entire hand
      else if (moveHand_lr || moveHand_ud)
      {
        visGuideCoords = rotateHand(diff, guide_coords, fingers, origin_palm, globalRotationAngles, moveHand_lr, moveHand_ud);
//        visPalm = rotatePalm(palm, origin_palm, globalRotationAngles);
        visPalm = createPalm(fingers, origin_palm, globalRotationAngles);
        redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
      }

      // reset for next mouse movement
      mouseCoords = newMouseCoords;

      // redraw everything
//       ctx.fillStyle = "rgb(200,200,100)";
//       ctx.fillRect(origin_palm.v[0]-3, origin_palm.v[1]-3, 6, 6);
//      debugText(ctx, visGuideCoords[1].v[0] - visGuideCoords[2].v[0]);

    }
  }

  // after dragging
  document.onmouseup = function(event)
  {
    mouseCoords = getMouseCoords(event);
    if (mouseCoords == null)
    {
      alert("Nothing!")
    }
    else
    {
      if (reset)
      {
        globalRotationAngles = [startGlobalZrotAng, startGlobalYrotAng, startGlobalXrotAng];
        visGuideCoords = rotateHand([0,0], guide_coords, fingers, origin_palm, globalRotationAngles, moveHand_lr, moveHand_ud);

        visPalm = createPalm(fingers, origin_palm, globalRotationAngles);

        redrawAllMove(ctx, origin_palm, visGuideCoords, fingers, visPalm, globalRotationAngles);
        reset = false;
      }

      moveHand_lr = false;
      moveHand_ud = false;

      movePoint = false;

      selectedPointIndex = null;
      selectedFinger = null;

//       document.getElementById('input_new_gesture_angles').value = getAnglesDeg(fingers, globalRotationAngles);
    }
  }
}


// -----------------------------------------------------------
// visualize the hand only
// -----------------------------------------------------------
function startVis(handArray)
{
  for(iterator=0; iterator<handArray.length; iterator++) {

    // initialize the canvas and context writer
    var canvas = document.getElementById("hand_"+handArray[iterator][0]);
    var ctx = canvas.getContext("2d");

    var thumb  = [handArray[iterator][2] * Math.PI/180, handArray[iterator][3] * Math.PI/180, handArray[iterator][4] * Math.PI/180, handArray[iterator][5] * Math.PI/180];
    var index  = [handArray[iterator][6] * Math.PI/180, handArray[iterator][7] * Math.PI/180, handArray[iterator][8] * Math.PI/180, handArray[iterator][9] * Math.PI/180];
    var middle = [handArray[iterator][10] * Math.PI/180, handArray[iterator][11] * Math.PI/180, handArray[iterator][12] * Math.PI/180, handArray[iterator][13] * Math.PI/180];
    var ring   = [handArray[iterator][14] * Math.PI/180, handArray[iterator][15] * Math.PI/180, handArray[iterator][16] * Math.PI/180, handArray[iterator][17] * Math.PI/180];
    var pinky  = [handArray[iterator][18] * Math.PI/180, handArray[iterator][19] * Math.PI/180, handArray[iterator][20] * Math.PI/180, handArray[iterator][21] * Math.PI/180];
    var global = [handArray[iterator][22] * Math.PI/180, handArray[iterator][23] * Math.PI/180, handArray[iterator][24] * Math.PI/180];
    var handedness = handArray[iterator][25];

    var shrinkFactor = 180.0/400.0;

    // set up the hand
    var origin_palm = new Vector(90, 90, 0);

    // draw the fancy circle around everything
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.arc(origin_palm.v[0], origin_palm.v[1], 90, 0, Math.PI * 2, 0);
    ctx.fill();

    var fingers = Hand(origin_palm, 30, shrinkFactor, handedness);

    var angles = thumb.concat(index, middle, ring, pinky, global);

    applyAngles(angles, fingers, origin_palm, handedness);

    // how do i get the angles out again?????

    applyRotToAllFingers(fingers, origin_palm, angles.slice(-3));
    var visPalm = createPalm(fingers, origin_palm, angles.slice(-3));

    redrawAllVis(ctx, origin_palm, fingers, visPalm, angles.slice(-3), shrinkFactor);
  }
}

// -----------------------------------------------------------
// apply an array of angles to the hand
// -----------------------------------------------------------
function applyAngles(angles, fingers, isLeft)
{
  for (var f = 0; f < fingers.length; ++f)
  {
    fingers[f].jointAngles = angles.slice(f * 4, (f + 1) * 4);
    fingers[f].recalc();
  }
}

// -----------------------------------------------------------
// one place to describe the hand and do all the dirty work
// -----------------------------------------------------------
function Hand(origin_palm, spacing, shrinkFactor, isLeftHand)
{

  if (isLeftHand)
  {
    // define the origin of each finger
    var origin_thumb = new Vector(origin_palm.v[0] - spacing * shrinkFactor, origin_palm.v[1], -125 * shrinkFactor);
    var origin_index = new Vector(origin_palm.v[0] - spacing * shrinkFactor, origin_palm.v[1], 0);
    var origin_middle = new Vector(origin_palm.v[0], origin_palm.v[1], 0);
    var origin_ring = new Vector(origin_palm.v[0] + spacing * shrinkFactor, origin_palm.v[1], -10 * shrinkFactor);
    var origin_pinky = new Vector(origin_palm.v[0] + 2 * spacing * shrinkFactor, origin_palm.v[1], -20 * shrinkFactor);
  }
  else
  {
    // define the origin of each finger
    var origin_thumb = new Vector(origin_palm.v[0] + spacing * shrinkFactor, origin_palm.v[1], -125 * shrinkFactor);
    var origin_index = new Vector(origin_palm.v[0] + spacing * shrinkFactor, origin_palm.v[1], 0);
    var origin_middle = new Vector(origin_palm.v[0], origin_palm.v[1], 0);
    var origin_ring = new Vector(origin_palm.v[0] - spacing * shrinkFactor, origin_palm.v[1], -10 * shrinkFactor);
    var origin_pinky = new Vector(origin_palm.v[0] - 2 * spacing * shrinkFactor, origin_palm.v[1], -20 * shrinkFactor);
  }

  var numPoints = 6;
  var numPhalanges = 4;

  // define the segment lengths for each finger
  var thumbHeights = new Array(0, 80 * shrinkFactor, 53 * shrinkFactor, 46 * shrinkFactor);
  var indexHeights = new Array(0, 73 * shrinkFactor, 46 * shrinkFactor, 37 * shrinkFactor);
  var middleHeights = new Array(0, 78 * shrinkFactor, 52 * shrinkFactor, 37 * shrinkFactor);
  var ringHeights = new Array(0, 75 * shrinkFactor, 51 * shrinkFactor, 37 * shrinkFactor);
  var pinkyHeights = new Array(0, 60 * shrinkFactor, 37 * shrinkFactor, 35 * shrinkFactor);

  // create each finger
  var thumb = new Finger(origin_thumb, numPoints, numPhalanges, thumbHeights, 'thumb', isLeftHand);
  var indexFinger = new Finger(origin_index, numPoints, numPhalanges, indexHeights, 'index', isLeftHand);
  var middleFinger = new Finger(origin_middle, numPoints, numPhalanges, middleHeights, 'middle', isLeftHand);
  var ringFinger = new Finger(origin_ring, numPoints, numPhalanges, ringHeights, 'ring', isLeftHand);
  var pinkyFinger = new Finger(origin_pinky, numPoints, numPhalanges, pinkyHeights, 'pinky', isLeftHand);

  return [thumb, indexFinger, middleFinger, ringFinger, pinkyFinger];
}

// -----------------------------------------------------------
// switch between left and right hand orientations
// -----------------------------------------------------------
function switchHands(fingers, globalRotationAngles, origin_palm, spacing, shrinkFactor, handedness)
{
  if (handedness == fingers[0].isLeft) {
    return fingers;
  }
  else {
    // now, grab all the angles from the current hand
    var angles = getAnglesRad(fingers, globalRotationAngles);
    // now, create a new hand
    var newFingers = Hand(origin_palm, spacing, shrinkFactor, handedness);
    applyAngles(angles, newFingers, handedness);
    applyRotToAllFingers(newFingers, origin_palm, globalRotationAngles);

    return newFingers;
  }
}

// -----------------------------------------------------------
// collect z-coords of visualized points
// -----------------------------------------------------------
function buildFingerZ(fingers, palmAvg, thumbAvg)
{
  // array for z coords
  var fingerZ = new Array(fingers.length);

  // array for matching coords
  var matchTable = new Array();

  for (var g = 0; g < fingers.length; ++g)
  {
    fingerZ[g] = new Array(fingers[g].numPhalanges);
    for (var ph = 0; ph < fingers[g].numPhalanges; ++ph)
    {
      fingerZ[g][ph] = fingers[g].visPoints[ph].v[2] + fingers[g].visPoints[ph+1].v[2];
      fingerZ[g][ph] /= 2;

      var unmatched = true;

      for (var i = 0; i < matchTable.length; ++i)
      {
        if (matchTable[i][0] == fingerZ[g][ph])
        {
          matchTable[i][1].push([g, ph]);
          unmatched = false;
        }
      }

      if (unmatched)
      {
        matchArray = new Array();
        matchArray.push([g, ph]);
        matchTable.push([fingerZ[g][ph], matchArray]);
      }

    }
  }

  var palmUnmatched = true;

  for (var i = 0; i < matchTable.length; ++i)
  {
    if (matchTable[i][0] == palmAvg)
    {
      matchTable[i][1].push([0, 'p']);
      palmUnmatched = false;
    }
  }

  if (palmUnmatched)
  {
    matchArray = new Array();
    matchArray.push([0, 'p']);
    matchTable.push([palmAvg, matchArray]);
  }

  var thumbUnmatched = true;

  for (var i = 0; i < matchTable.length; ++i)
  {
    if (matchTable[i][0] == thumbAvg)
    {
      matchTable[i][1].push([0, 't']);
      thumbUnmatched = false;
    }
  }

  if (thumbUnmatched)
  {
    matchArray = new Array();
    matchArray.push([0, 't']);
    matchTable.push([thumbAvg, matchArray]);
  }


  return [fingerZ, matchTable];
}

// -----------------------------------------------------------
// calculate the average z coord of the palm's vis points
// -----------------------------------------------------------
function calcPalmAvgZ(visPalm)
{
  var palmAvg = 0;
  for (var i = 3; i < visPalm.length; ++i)
  {
    palmAvg += visPalm[i].v[2];
  }
  palmAvg /= visPalm.length;
  return palmAvg;
}

// -----------------------------------------------------------
// calculate the average z coord of the palm-thumb's vis points
// -----------------------------------------------------------
function calcThumbAvgZ(visPalm)
{
  var palmAvg = 0;
  for (var i = 0; i <= 3; ++i)
  {
    palmAvg += visPalm[i].v[2];
  }
  palmAvg /= visPalm.length;
  return palmAvg;
}

// -----------------------------------------------------------
// determine drawing order
// -----------------------------------------------------------
function getDrawingOrder(fingerArrays)
{
  var fingerZ = fingerArrays[0];
  var matchTable = fingerArrays[1];

  var drawingOrder = new Array();
  var minZ = 100000; // some ridiculously large number
  var prevMinZ = -100000; // some ridiculously low number

  while (drawingOrder.length < fingerZ.length * fingerZ[0].length + 2)
  {
    for (var i = 0; i < matchTable.length; ++i)
    {
      var inQuestion = parseFloat(matchTable[i][0]);
      if (inQuestion < minZ && inQuestion > prevMinZ)
      {
//        alert('i: ' + i + ' minZ: ' + minZ + ' inQ: ' + inQuestion + ' prev: ' + prevMinZ);
        minZ = inQuestion;
        loc = i;
      } // if
    } // for i

    for (var m = 0; m < matchTable[loc][1].length; ++m)
    {
      drawingOrder.push(matchTable[loc][1][m]);
    } // for m

    prevMinZ = minZ;
    minZ = 100000;
  } // while

  return drawingOrder;
}

// -----------------------------------------------------------
// clears the board and draws everything fresh for startMove()
// -----------------------------------------------------------
function redrawAllMove(ctx, origin_palm, guide_coords, fingers, visPalm, globalRotationAngles)
{
  // clear the board
  ctx.clearRect(0,0,400,400);

  // calculate the average z coord of the palm's vis points
  var palmAvg = calcPalmAvgZ(visPalm);
  var thumbAvg = calcThumbAvgZ(visPalm);

  // figure out what to draw in what order
  var fingerArrays = buildFingerZ(fingers, palmAvg, thumbAvg);

  // now compile them into one array in the order in which they should be drawn
  var drawingOrder = getDrawingOrder(fingerArrays, palmAvg, thumbAvg);

  for (d = 0; d < drawingOrder.length; ++d)
  {
    var drawNow = drawingOrder[d];
    if (drawNow[1] == 'p')
    {
      drawPalm(ctx, visPalm, 1);
    }
    else if (drawNow[1] == 't')
    {
      drawThumb(ctx, visPalm, 1);
    }
    else
    {
      var fingNum = drawNow[0];
      var phalNum = drawNow[1];
      if (phalNum != 0)
      {
        drawPhalanx(ctx, fingers[fingNum], phalNum, 1);
        drawFingerPoint(ctx, fingers[fingNum], phalNum);
      }
    }
  }

//  drawFingerPoints(ctx, fingers);

  drawCoords(ctx, guide_coords);
}

// -----------------------------------------------------------
// clears the board and draws everything fresh for startVis()
// -----------------------------------------------------------
function redrawAllVis(ctx, origin_palm, fingers, visPalm, globalRotationAngles, shrinkFactor)
{
  // clear the board
//  ctx.clearRect(0,0,400,400);

  // calculate the average z coord of the palm's vis points
  var palmAvg = calcPalmAvgZ(visPalm);
  var thumbAvg = calcThumbAvgZ(visPalm);

  // figure out what to draw in what order
  var fingerArrays = buildFingerZ(fingers, palmAvg, thumbAvg);

  // now compile them into one array in the order in which they should be drawn
  var drawingOrder = getDrawingOrder(fingerArrays, palmAvg, thumbAvg);

  for (d = 0; d < drawingOrder.length; ++d)
  {
    var drawNow = drawingOrder[d];
    if (drawNow[1] == 'p')
    {
      drawPalm(ctx, visPalm, shrinkFactor);
    }
    else if (drawNow[1] == 't')
    {
      drawThumb(ctx, visPalm, shrinkFactor);
    }
    else
    {
      var fingNum = drawNow[0];
      var phalNum = drawNow[1];
      if (phalNum != 0)
      {
        drawPhalanx(ctx, fingers[fingNum], phalNum, shrinkFactor);
      }
    }
  }
}

// -----------------------------------------------------------
// create palm
// -----------------------------------------------------------
function createPalm(fingers, origin, globalRotationAngles)
{
  var thumb = fingers[0].points3D;
  var index = fingers[1].points3D;
  var pinky = fingers[4].points3D;

  var atIndex = new Vector(index[0].v[0], index[0].v[1], index[0].v[2]);
  var atPinky = new Vector(pinky[0].v[0], pinky[0].v[1], pinky[0].v[2]);
  var atHeel = new Vector(pinky[0].v[0], thumb[0].v[1],
                         Math.min(thumb[0].v[2], thumb[0].v[2]));
  var atThenar = new Vector(thumb[0].v[0], thumb[0].v[1], thumb[0].v[2]);
  var atSquishy = new Vector(index[0].v[0], index[0].v[1],
                             (index[0].v[2] + thumb[0].v[2])/2);
  var atThumb = thumb[2];
  var palm = [atSquishy, atThumb, atThenar, atSquishy, atIndex, atPinky, atHeel, atThenar];

  var visPalm = new Array(palm.length);
  for (var i = 0; i < palm.length; ++i)
  {
    var vp = RotVectorAboutOrigin(palm[i], origin, globalRotationAngles, true);
//    alert(palm[i].v);
    visPalm[i] = new Vector(vp[0], vp[1], vp[2]);
  }

  return visPalm;
}

// -----------------------------------------------------------
// draws the palm
// -----------------------------------------------------------
function drawPalm(ctx, palm, shrinkFactor)
{
  ctx.lineWidth = 34 * shrinkFactor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.moveTo(palm[3].v[0], palm[3].v[1]);

  for (var i = 3; i < palm.length; ++i)
  {
    ctx.lineTo(palm[i].v[0], palm[i].v[1]);
  }

  ctx.stroke();
//   ctx.fill();

  ctx.lineWidth = 31 * shrinkFactor;
  ctx.strokeStyle = "rgb(255,203,162)";
  ctx.fillStyle = "rgb(255,203,162)";
  ctx.beginPath();
  ctx.moveTo(palm[palm.length-1].v[0], palm[palm.length-1].v[1]);

  for (i = 3; i < palm.length; ++i)
  {
    ctx.lineTo(palm[i].v[0], palm[i].v[1]);
  }

  ctx.stroke();
  ctx.fill();
}

// -----------------------------------------------------------
// draws the flappy part between the thumb and palm
// -----------------------------------------------------------
function drawThumb(ctx, palm, shrinkFactor)
{
  ctx.lineWidth = 34 * shrinkFactor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.moveTo(palm[0].v[0], palm[0].v[1]);

  for (var i = 0; i < 3; ++i)
  {
    ctx.lineTo(palm[i].v[0], palm[i].v[1]);
  }

  ctx.stroke();

  ctx.lineWidth = 31 * shrinkFactor;
  ctx.strokeStyle = "rgb(255,203,162)";
  ctx.fillStyle = "rgb(255,203,162)";
  ctx.beginPath();
  ctx.moveTo(palm[palm.length-1].v[0], palm[palm.length-1].v[1]);

  for (var i = 0; i <= 3; ++i)
  {
    ctx.lineTo(palm[i].v[0], palm[i].v[1]);
  }

  ctx.stroke();
  ctx.fill();
}

// -----------------------------------------------------------
// draw each individual phalanx
// -----------------------------------------------------------
function drawPhalanx(ctx, finger, phalanxNumber, shrinkFactor)
{
  if (phalanxNumber == 1)
  {
    var startPoint = finger.visPoints[0];
  }
  else
  {
    var startPoint = finger.visPoints[phalanxNumber];
  }
  var endPoint = finger.visPoints[phalanxNumber+1];

  if (finger.fingerType == 'thumb')
  {
    ctx.lineWidth = shrinkFactor * (34 - 1.5 * phalanxNumber);
  }
  else
  {
    ctx.lineWidth = shrinkFactor * (27 - 1.5 * phalanxNumber);
  }
  // draw outside of phalanx
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startPoint.v[0], startPoint.v[1]-2);
  ctx.lineTo(endPoint.v[0]+1, endPoint.v[1]+1);
  ctx.stroke();

  if (finger.fingerType == 'thumb')
  {
    ctx.lineWidth = shrinkFactor * (31 - 1.5 * phalanxNumber);
  }
  else
  {
    ctx.lineWidth = shrinkFactor * (24 - 1.5 * phalanxNumber);
  }
  // draw inside of finger
  ctx.strokeStyle = "rgb(255,203,162)";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startPoint.v[0], startPoint.v[1]);
  ctx.lineTo(endPoint.v[0]+1, endPoint.v[1]+1);
  ctx.stroke();

  // draw the point at the bottom of the phalanx
  if (shrinkFactor == 1)
  {
    drawFingerPoint(ctx, finger, phalanxNumber-1);
  }
}

// -----------------------------------------------------------
// draw the finger points for all fingers
// -----------------------------------------------------------
function drawFingerPoint(ctx, finger, phalanxNum)
{
  var colors = ["rgb(200, 200, 0)", "rgb(0,0,200)", "rgb(0,200,0)", "rgb(200,0,0)"];

  var fingerPoint = finger.visPoints[phalanxNum+1];
  ctx.fillStyle = colors[phalanxNum];
  ctx.beginPath();
  ctx.arc(fingerPoint.v[0], fingerPoint.v[1], 4, 0, Math.PI * 2, 0);
  ctx.fill();
}

// -----------------------------------------------------------
// move the finger joints in a reasonable way
// -----------------------------------------------------------
function moveFinger(ctx, startMouse, endMouse, selectedFinger, selectedPointIndex, origin_palm, globalRotAngles, visGuideCoords)
{
  // determine the rotation angle based on the mouse movement
  var visPoint = selectedFinger.visPoints[selectedPointIndex].v;
  var visJoint = selectedFinger.visPoints[selectedPointIndex-1].v;
  //var v1 = [ visPoint[0] - visJoint[0], visPoint[1] - visJoint[1] ];
  var v1 = [ startMouse[0] - visJoint[0], startMouse[1] - visJoint[1], startMouse[2] - visJoint[2], 1 ];
  var v2 = [ endMouse[0] - visJoint[0], endMouse[1] - visJoint[1], endMouse[2] - visJoint[2], 1 ];

  var vis1 = RotVectorAboutOrigin(v1, origin_palm, globalRotAngles);
//   alert(vis1);
  var newV1 = new Vector(vis1[0] + selectedFinger.points3D[selectedPointIndex-1].v[0], vis1[1] + selectedFinger.points3D[selectedPointIndex-1].v[1], vis1[2] + selectedFinger.points3D[selectedPointIndex-1].v[2]);
//   alert(newV1.v);

  var vis2 = RotVectorAboutOrigin(v2, origin_palm, globalRotAngles);
//   alert(vis2);
  var newV2 = new Vector(vis2[0] + selectedFinger.points3D[selectedPointIndex-1].v[0], vis2[1] + selectedFinger.points3D[selectedPointIndex-1].v[1], vis2[2] + selectedFinger.points3D[selectedPointIndex-1].v[2]);
//   alert(newV2.v);

  v1 = newV1.v;
  v2 = newV2.v;

  var v1dotv2 = v1[0] * v2[0] + v1[1] * v2[1];
  var v1crossv2 = v1[0] * v2[1] - v1[1] * v2[0];

  var magv1 = Math.sqrt( v1[0] * v1[0] + v1[1] * v1[1] );
  var magv2 = Math.sqrt( v2[0] * v2[0] + v2[1] * v2[1] );

  var mouseRotAng = Math.acos( v1dotv2 / (magv1 * magv2) );

  var diffX = [visGuideCoords[1].v[0] - visGuideCoords[0].v[0], visGuideCoords[1].v[1] - visGuideCoords[0].v[1], visGuideCoords[1].v[2] - visGuideCoords[0].v[2]];
  var diffY = [visGuideCoords[2].v[0] - visGuideCoords[0].v[0], visGuideCoords[2].v[1] - visGuideCoords[0].v[1], visGuideCoords[2].v[2] - visGuideCoords[0].v[2]];
  var diffZ = [visGuideCoords[3].v[0] - visGuideCoords[0].v[0], visGuideCoords[3].v[1] - visGuideCoords[0].v[1], visGuideCoords[3].v[2] - visGuideCoords[0].v[2]];
  var xCrossY = diffX[0] * diffY[1] - diffX[1] * diffY[0];
  var yCrossZ = diffY[0] * diffZ[1] - diffY[1] * diffZ[0];
  var zCrossX = diffZ[0] * diffX[1] - diffZ[1] * diffX[0];

  var compareToVisGuideCoords;
  if (selectedFinger.fingerType == 'thumb')
  {
    if (selectedPointIndex == 1) {
      if (selectedFinger.isLeft)  { compareToVisGuideCoords = yCrossZ; }
      else  { compareToVisGuideCoords = -yCrossZ; }
    }
    else {
      if (selectedFinger.isLeft)  { compareToVisGuideCoords = -xCrossY; }
      else  { compareToVisGuideCoords = xCrossY; }
    }
  }
  else
  {
    if (selectedPointIndex == 1) {
      if (selectedFinger.isLeft) { compareToVisGuideCoords = -yCrossZ * zCrossX; }
      else { compareToVisGuideCoords = yCrossZ * zCrossX; }
    }
    else {
      compareToVisGuideCoords = yCrossZ;
    }
  }

  // determine the rotation angle
  var rotAngle = 2 * Math.PI/180;// mouseRotAng; //Math.PI/30;
  var zRotAng = 0;

  // rotate around z axis
  if (mouseRotAng)
  {
    if (v1crossv2 > 0)
    {
//      if (compareToVisGuideCoords > 0)  { zRotAng = -rotAngle; }
       { zRotAng = rotAngle;  }
    }
    else if (v1crossv2 < 0)
    {
//      if (compareToVisGuideCoords > 0)  { zRotAng = rotAngle;  }
       { zRotAng = -rotAngle; }
    }

  }
  // apply new joint angles to finger
  selectedFinger.jointAngles[selectedPointIndex-1] += zRotAng;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.font = "10pt Arial";
  ctx.clearRect(400,0,400,400);
  ctx.strokeText('finger: ' + selectedFinger.fingerType, 410, 10);

  ctx.strokeText('joint0: ' + (selectedFinger.jointAngles[0] * 180/Math.PI), 410, 40);
  ctx.strokeText('joint1: ' + (selectedFinger.jointAngles[1] * 180/Math.PI), 410, 70);
  ctx.strokeText('joint2: ' + (selectedFinger.jointAngles[2] * 180/Math.PI), 410, 100);
  ctx.strokeText('joint3: ' + (selectedFinger.jointAngles[3] * 180/Math.PI), 410, 130);

//   var D = new Array(3);
//   for (var k = 0; k < D.length; ++k)
//   {
//    D[k] = [visGuideCoords[k+1].v[0] - visGuideCoords[0].v[0],
//            visGuideCoords[k+1].v[1] - visGuideCoords[0].v[1],
//            visGuideCoords[k+1].v[2] - visGuideCoords[0].v[2]];
//   }
//  var v1crossv2 = v1[0] * v2[1] - v1[1] * v2[0];

  ctx.strokeText('rot: ' + zRotAng, 410, 170);
  ctx.strokeText('FingPos3d: ' + selectedFinger.points3D[selectedPointIndex].v, 410, 200);
  ctx.strokeText('FingPosVis: ' + selectedFinger.visPoints[selectedPointIndex].v, 410, 230);

//   ctx.strokeText('diffX: ' + diffX, 410, 200);
//   ctx.strokeText('diffY: ' + diffY, 410, 230);
//   ctx.strokeText('diffZ: ' + diffZ, 410, 260);
  ctx.strokeText('v1: ' + v1, 410, 290);
  ctx.strokeText('v2: ' + v2, 410, 320);
//  ctx.strokeText('diffX x diffY: ' + (D[0][0] * D[1][1] - D[0][1] * D[1][0]), 410, 300);
//  ctx.strokeText('diffY x diffZ: ' + (D[1][0] * D[2][1] - D[1][1] * D[2][0]), 410, 330);
//  ctx.strokeText('diffZ x diffX: ' + (D[2][0] * D[0][1] - D[2][1] * D[0][0]), 410, 360);


  // recalculate 3D position of finger
  selectedFinger.recalc();

  // interpret 3D points to visual points:

  // go through each finger point

  for (var p = 0; p < selectedFinger.points3D.length; ++p)
  {
    // update the viewer coordinates of each point
    var vip = RotVectorAboutOrigin(selectedFinger.points3D[p], origin_palm, globalRotAngles, true);
    selectedFinger.visPoints[p] = new Vector(vip[0], vip[1], vip[2]);
  }

  // for the 1st point, we want it located approx 1/3 of the way up the finger
  var pt0 = selectedFinger.visPoints[1].v;
  var pt1 = selectedFinger.visPoints[2].v;
  vip = [pt1[0] - pt0[0], pt1[1] - pt0[1], pt1[2] - pt0[2]];
  selectedFinger.visPoints[1] = new Vector(pt0[0] + vip[0] / 3, pt0[1] + vip[1] / 3, pt0[2] + vip[2] / 3);

}

// -----------------------------------------------------------
// rotate the hand and the guide around the palm's origin
// -----------------------------------------------------------
function rotateHand(diff, guide_coords, fingers, origin_palm, globalRotAng, moveHand_lr, moveHand_ud)
{
  var rotAngle = Math.PI/30;

  if (moveHand_lr)
  {
    if ( diff[0] < -1 )
    {
      globalRotAng[1] -= rotAngle;
    }
    if ( diff[0] > 1 )
    {
      globalRotAng[1] += rotAngle;
    }
  }
  if (moveHand_ud)
  {
    if ( diff[1] > 1 )
    {
      globalRotAng[2] -= rotAngle;
    }
    if ( diff[1] < -1 )
    {
      globalRotAng[2] += rotAngle;
    }
  }

  // calculate the visualized coordinates
  var visGuideCoords = rotateCoords(guide_coords, globalRotAng);

  applyRotToAllFingers(fingers, origin_palm, globalRotAng);

  return visGuideCoords;
}

// -----------------------------------------------------------
// apply a given rotation to all the fingers in the hand
// -----------------------------------------------------------
function applyRotToAllFingers(fingers, origin_palm, rotAngles)
{
  // go through each finger
  for (var f = 0; f < fingers.length; ++f)
  {
    var thisFinger = fingers[f];

    // go through each finger point
    for (var p = 0; p < thisFinger.points3D.length; ++p)
    {
      // update the viewer coordinates of each point
      var vip = RotVectorAboutOrigin(thisFinger.points3D[p], origin_palm, rotAngles, true);
      thisFinger.visPoints[p] = new Vector(vip[0], vip[1], vip[2]);
    }

    // for the 1st point, we want it located approx 1/3 of the way up the finger
    var pt0 = thisFinger.visPoints[1].v;
    var pt1 = thisFinger.visPoints[2].v;
    vip = [pt1[0] - pt0[0], pt1[1] - pt0[1], pt1[2] - pt0[2]];
    thisFinger.visPoints[1] = new Vector(pt0[0] + vip[0] / 3, pt0[1] + vip[1] / 3, pt0[2] + vip[2] / 3);
  }
}

// -----------------------------------------------------------
// apply inverse rotation to a point
// -----------------------------------------------------------
function applyInverseRotation(origin_palm, globalRotAngles, pt)
{
  var invRotAng = [-globalRotAngles[0], -globalRotAngles[1], -globalRotAngles[2] ];

  var inv = RotVectorAboutOrigin(pt, origin_palm, invRotAng);
  return inv;
}

// -----------------------------------------------------------
// angle limits, as posed by Winnie Tsang's Master thesis, "Helping
// Hand: An Atomically Accurate Inverse Dynamics Solution for
// Unconstrained Hand Motion," 2005
// -----------------------------------------------------------
function calcMinAndMaxJointAngles(fingerType, isLeft)
{
  var minAngles = new Array(4);
  var maxAngles = new Array(4);
  if (fingerType == 'thumb')
  {
    minAngles[0] = -10 * Math.PI/180;
    maxAngles[0] = 70 * Math.PI/180;
    minAngles[1] = -40 * Math.PI/180;
    maxAngles[1] = 15 * Math.PI/180;
    minAngles[2] = 0;
    maxAngles[2] = 50 * Math.PI/180;
    minAngles[3] = 0;
    maxAngles[3] = 80 * Math.PI/180;
  }
  else
  {
    if (fingerType == 'index')
    {
      minAngles[0] = -20 * Math.PI/180;
      maxAngles[0] = 20 * Math.PI/180;
    }
    else if (fingerType == 'middle')
    {
      minAngles[0] = -10 * Math.PI/180;
      maxAngles[0] = 10 * Math.PI/180;
    }
    else if (fingerType == 'ring')
    {
      minAngles[0] = -5 * Math.PI/180;
      maxAngles[0] = 15 * Math.PI/180;
    }
    else
    {
      minAngles[0] = -5 * Math.PI/180;
      maxAngles[0] = 20 * Math.PI/180;
    }

    minAngles[1] = -10 * Math.PI/180;
    maxAngles[1] = 90 * Math.PI/180;
    minAngles[2] = 0;
    maxAngles[2] = 100 * Math.PI/180;
    minAngles[3] = -10 * Math.PI/180;
    maxAngles[3] = 90 * Math.PI/180;
  }
  return [minAngles, maxAngles];
}

// -----------------------------------------------------------
// Finger class - might make things a bit easier? - later!!
// -----------------------------------------------------------
function Finger(origin, numPoints, numPhalanges, heights, fingerType, isLeft)
{
  // VARIABLES
  this.origin = origin;
  this.numPoints = numPoints;
  this.numPhalanges = numPhalanges;
  this.heights = heights;
  this.fingerType = fingerType;
  this.isLeft = isLeft;

  // initialize the joint angles
  this.jointAngles = new Array(numPhalanges);
  for (var jointNum = 0; jointNum < this.jointAngles.length; ++jointNum)
  {
    this.jointAngles[jointNum] = 0;
  }

  // initialize the manipulator
  if (this.fingerType == 'thumb')
  {
    this.jointAngles[0] = 15 * Math.PI/180;
    this.jointAngles[1] = -20 * Math.PI/180;
    // different manipulator!
    this.manipulator = new ThumbManipulator(origin, numPhalanges, heights, isLeft);
  }
  else
  {
    this.manipulator = new Manipulator(origin, numPhalanges, heights, isLeft);
  }

  // define the 3-dimensional locations of each point along the finger
  this.points3D = this.manipulator.recalcManipulator(this.jointAngles);

  // define the 2-dimensional locations viewed by the user
  this.visPoints = new Array(this.points3D.length);

  // FUNCTIONS
  this.recalc = function()
  {
    var jointLimits = calcMinAndMaxJointAngles(this.fingerType, this.isLeft);

    for (var j = 0; j < this.jointAngles.length; ++j)
    {
      if (this.jointAngles[j] < jointLimits[0][j])
      {
        this.jointAngles[j] = jointLimits[0][j];
      }
      else if (this.jointAngles[j] > jointLimits[1][j])
      {
        this.jointAngles[j] = jointLimits[1][j];
      }
    }

    // send the joint angles to the manipulator
    this.points3D = this.manipulator.recalcManipulator(this.jointAngles);

    // also send the joint angles to the phalanges
//     this.phalanges = calcPhalanges(this.numPoints, this.numPhalanges, this.points3D, this.jointAngles);
  }

  this.reset = function()
  {
    // set joint angles back to initial values
    for (var jointNum = 0; jointNum < this.jointAngles.length; ++jointNum)
    {
      this.jointAngles[jointNum] = 0;
    }

    if (this.fingerType == 'thumb')
    {
      this.jointAngles[0] = 15 * Math.PI/180;
      this.jointAngles[1] = -20 * Math.PI/180;
    }

    // recalculate the manipulator
    this.recalc();
  }
}

// -----------------------------------------------------------
// create a coordinate system based on an origin and armlength
// -----------------------------------------------------------
function createCoords(origin, lengthOfArm)
{
  var x = new Vector(origin.v[0] + lengthOfArm, origin.v[1], origin.v[2]);
  var y = new Vector(origin.v[0], origin.v[1] + lengthOfArm, origin.v[2]);
  var z = new Vector(origin.v[0], origin.v[1], origin.v[2] + lengthOfArm);

  return new Array(origin, x, y, z);
}

// -----------------------------------------------------------
// rotate coordinate system
// -----------------------------------------------------------
function rotateCoords(guide_coords, globalRotationAngles)
{
  var visGuideCoords = new Array(guide_coords.length);
  for (var i = 1; i < guide_coords.length; ++i)
  {
    var vgc = RotVectorAboutOrigin(guide_coords[i], guide_coords[0], globalRotationAngles, true);
    visGuideCoords[i] = new Vector(vgc[0], vgc[1], vgc[2]);
  }
  visGuideCoords[0] = new Vector(guide_coords[0].v[0], guide_coords[0].v[1], guide_coords[0].v[2])

  return visGuideCoords;
}

// -----------------------------------------------------------
// draws the coordinate orientation guide in the lower
// left-hand corner of the canvas
// -----------------------------------------------------------
function drawCoords(ctx, points)
{
  // designate the colors for each point/ray
  var colors = new Array("rgb(0,0,0)",
                         "rgb(200,0,0)",
                         "rgb(0,0,200)",
                         "rgb(0,200,0)");

  // draw each ray from the origin
  var o = points[0].v; // origin

  for (var i = 1; i < points.length; ++i)
  {
    var v = points[i].v; // vector
    ctx.fillStyle = colors[0];
    ctx.fillRect (o[0],o[1],4,4);

    ctx.lineWidth = 2;
    ctx.strokeStyle = colors[i];
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(o[0]+2, o[1]+2);
    ctx.lineTo(v[0]+2, v[1]+2);
    ctx.stroke();

    ctx.fillStyle = colors[i];
    ctx.fillRect (v[0],v[1],4,4);
  }

// draw the box around the guide
//   ctx.strokeStyle = colors[0];
//   ctx.strokeRect(370,370,30,30);
//
// draw the left-right box
//   ctx.strokeRect(0,370,370,30);
//
// draw the up-down box
//   ctx.strokeRect(370,0,30,370);

  ctx.beginPath();
  // draw the left-right arrows
  ctx.strokeStyle = "rgb(128,128,128)";
  ctx.moveTo(10,385);
  ctx.lineTo(20,390);
  ctx.moveTo(10,385);
  ctx.lineTo(20,380);
  ctx.moveTo(10,385);
  ctx.lineTo(360,385);
  ctx.moveTo(360,385);
  ctx.lineTo(350,390);
  ctx.moveTo(360,385);
  ctx.lineTo(350,380);

  // draw the up-down box and arrows
  ctx.moveTo(385,10);
  ctx.lineTo(390,20);
  ctx.moveTo(385,10);
  ctx.lineTo(380,20);
  ctx.moveTo(385,10);
  ctx.lineTo(385,360);
  ctx.moveTo(385,360);
  ctx.lineTo(390,350);
  ctx.moveTo(385,360);
  ctx.lineTo(380,350);
  ctx.stroke();

}

// -----------------------------------------------------------
// grab mouse coordinates from the window
// -----------------------------------------------------------
function getMouseCoords(event)
{
  if (event == null)
  {
    alert("mouse event resulted in null");
    event = window.event;
    return null;
  }
  // NOTE: This is specific to Safari; will need to be changed
  // for FF & IE
  if (event.offsetX || event.offsetY)
  {
    var coords = new Vector(event.offsetX, event.offsetY, 0);
    return coords.v;
  }
  return null;
}

// -----------------------------------------------------------
// math.js - math code
// -----------------------------------------------------------

// -----------------------------------------------------------
// Vector class
// -----------------------------------------------------------
function Vector(x, y, z)
{
  this.v = new Array(x,y,z,1);

  // check to see if the vector is within a given distance to
  // a point
  this.withinRadiusAroundPoint = function(r, p)
  {
    var dx = this.v[0] - p[0];
    var dy = this.v[1] - p[1];
    return (dx * dx + dy * dy) < (r * r);
  }

  // rotate the vector about an origin
  this.rotateAboutOrigin = function(o, rotAngles)
  {
    var rv = RotVectorAboutOrigin(this.v, o, rotAngles);
    for (var i = 0; i < rv.length; ++i)
    {
      this.v[i] = rv[i];
    }
  }

  // move the vector to another point
  this.moveTo = function(p)
  {
    this.v[0] = p.v[0];
    this.v[1] = p.v[1];
    this.v[2] = p.v[2];
  }

  // calculate the distance from another vector
  this.distanceFrom = function(b)
  {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i)
    {
      sumOfSquares += (this.v[i] - b.v[i]) * (this.v[i] - b.v[i]);
    }

    return Math.sqrt(sumOfSquares);
  }
}

// -----------------------------------------------------------
// multiply two matrices together
// -----------------------------------------------------------
function MultiplyMatrices(A,B)
{
  var size = A.size;
  var m = new SqMat(size);

  for (var i = 0; i < size; ++i)
  {
    for (var j = 0; j < size; ++j)
    {
      var val = 0;
      for (var k = 0; k < size; ++k)
      {
         val += A.get(i,k) * B.get(k,j);
      }
      m.set(i, j, val);
    }
  }
  return m;
}

// -----------------------------------------------------------
// Square Matrix class
// -----------------------------------------------------------
function SqMat(size)
{
  // initialize the matrix
  this.size = size;
  this.A = new Array(size);
  for (var i = 0; i < size; ++i)
  {
    this.A[i] = new Array(size);
  }

  // set values
  this.set = function(i,j,val)
  {
    this.A[i][j] = val;
  }

  // get values
  this.get = function(i,j)
  {
    return this.A[i][j];
  }

  // get position info
  this.getPos = function()
  {
    var pos = new Vector(0, 0, 0);

    for (var i = 0; i < size-1; ++i)
    {
      pos.v[i] = this.A[i][size-1];
    }

    return pos;
  }

  // mutliply the matrix by another matrix
  this.multiplyByMatrix = function(B)
  {
    var m = MultiplyMatrices(this, B);

    this.A = m.A;
  }

  // multiply the matrix by a vector
  this.multiplyByVector = function(v)
  {

    var vec = new Array(size);

    for (var i = 0; i < size; ++i)
    {
      vec[i] = 0;
      for (var k = 0; k < size; ++k)
      {
        vec[i] += this.A[i][k] * v[k];
      }
    }
    return vec;
  }

  // determine the transpose of the matrix
  this.transpose = function()
  {
    var T = new Array(size);

    for(var i = 0; i < size; ++i)
    {
      T[i] = new Array(size);
      for (var j = 0; j < size; ++j)
      {
        T[i][j] = this.A[j][i];
      }
    }
    return T;
  }
}

// -----------------------------------------------------------
// rotation matrix around the X axis
// -----------------------------------------------------------
function RotX(theta)
{
  var R = new SqMat(4);

  R.set(0, 0, 1);
  R.set(0, 1, 0);
  R.set(0, 2, 0);
  R.set(0, 3, 0);

  R.set(1, 0, 0);
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, -Math.sin(theta));
  R.set(1, 3, 0);

  R.set(2, 0, 0);
  R.set(2, 1, Math.sin(theta));
  R.set(2, 2, Math.cos(theta));
  R.set(2, 3, 0);

  R.set(3, 0, 0);
  R.set(3, 1, 0);
  R.set(3, 2, 0);
  R.set(3, 3, 1);

  return R;
}

// -----------------------------------------------------------
// rotation matrix around the Y axis
// -----------------------------------------------------------
function RotY(theta)
{
  var R = new SqMat(4);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, 0);
  R.set(0, 2, Math.sin(theta));
  R.set(0, 3, 0);

  R.set(1, 0, 0);
  R.set(1, 1, 1);
  R.set(1, 2, 0);
  R.set(1, 3, 0);

  R.set(2, 0, -Math.sin(theta));
  R.set(2, 1, 0);
  R.set(2, 2, Math.cos(theta));
  R.set(2, 3, 0);

  R.set(3, 0, 0);
  R.set(3, 1, 0);
  R.set(3, 2, 0);
  R.set(3, 3, 1);

  return R;
}

// -----------------------------------------------------------
// rotation matrix around the Z axis
// -----------------------------------------------------------
function RotZ(theta)
{
  var R = new SqMat(4);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, -Math.sin(theta));
  R.set(0, 2, 0);
  R.set(0, 3, 0);

  R.set(1, 0, Math.sin(theta));
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, 0);
  R.set(1, 3, 0);

  R.set(2, 0, 0);
  R.set(2, 1, 0);
  R.set(2, 2, 1);
  R.set(2, 3, 0);

  R.set(3, 0, 0);
  R.set(3, 1, 0);
  R.set(3, 2, 0);
  R.set(3, 3, 1);

  return R;
}

// -----------------------------------------------------------
// rotate ZYX
// -----------------------------------------------------------
function Rot(zRotAng, yRotAng, xRotAng)
{
  return MultiplyMatrices( MultiplyMatrices(RotZ(zRotAng), RotY(yRotAng)), RotX(xRotAng) );
//  return MultiplyMatrices( MultiplyMatrices(RotX(xRotAng), RotY(yRotAng)), RotZ(zRotAng) );
}

// -----------------------------------------------------------
// translation matrix
// -----------------------------------------------------------
function Trans(x,y,z)
{
  var R = new SqMat(4);

  R.set(0, 0, 1);
  R.set(0, 1, 0);
  R.set(0, 2, 0);
  R.set(0, 3, x);

  R.set(1, 0, 0);
  R.set(1, 1, 1);
  R.set(1, 2, 0);
  R.set(1, 3, y);

  R.set(2, 0, 0);
  R.set(2, 1, 0);
  R.set(2, 2, 1);
  R.set(2, 3, z);

  R.set(3, 0, 0);
  R.set(3, 1, 0);
  R.set(3, 2, 0);
  R.set(3, 3, 1);

  return R;
}

// -----------------------------------------------------------
// rotate a vector about a defined origin by angles
// zRotAng (yaw), yRotAng (pitch), xRotAng (roll)
// -----------------------------------------------------------
function RotVectorAboutOrigin(vector, origin, rotAngles, on)
{
  var T = Trans(-origin.v[0], -origin.v[1], -origin.v[2]);
  var R = MultiplyMatrices( MultiplyMatrices(RotZ(rotAngles[0]), RotY(rotAngles[1])), RotX(rotAngles[2]) );
  var Trev = Trans(origin.v[0], origin.v[1], origin.v[2]);

  var TRTrev = MultiplyMatrices( Trev, MultiplyMatrices(R, T) );
  if (on)
  {
    return TRTrev.multiplyByVector(vector.v);
  }

  return TRTrev.multiplyByVector(vector);
}

// -----------------------------------------------------------
// define a manipulator system
// -----------------------------------------------------------
function Manipulator(origin, numJoints, heights, isLeft)
{
  // set up the manipulator
  this.origin = origin;
  this.tipPos;

  // recalculate the position of the end effector (fingertip)
  this.recalcManipulator = function(jointAngles)
  {
    // prepare to return the positions of each joint
    var pointPositions = new Array(jointAngles+1);

    // start at the origin
    var T = Trans(this.origin.v[0], this.origin.v[1], this.origin.v[2]);

    // orient joint coordinates
    T.multiplyByMatrix(RotY(-Math.PI/2));

    // apply side-to-side rotation to base
    T.multiplyByMatrix(RotX(-Math.PI/2));
  if (isLeft)
  {
      T.multiplyByMatrix(RotZ(jointAngles[0]));
  }
  else
  {
      T.multiplyByMatrix(RotZ(-jointAngles[0]));
  }
    pointPositions[0] = T.getPos();

    // rotate for front-to-back rotations for other joints
    T.multiplyByMatrix(RotX(Math.PI/2));
    pointPositions[1] = T.getPos();

    var A;
    for (var j = 1; j < jointAngles.length; ++j)
    {
      A = MultiplyMatrices(RotZ(jointAngles[j]), Trans(heights[j],0,0));
      T.multiplyByMatrix(A);
      pointPositions[j+1] = T.getPos();
    }

    // finish with the final positions
    this.tipPos = T.getPos();
    return pointPositions;
  }

  this.getPos = function()
  {
    return this.tipPos;
  }
}

// -----------------------------------------------------------
// define a manipulator system specific to thumbs
// -----------------------------------------------------------
function ThumbManipulator(origin, numJoints, heights, isLeft)
{
  // set up the manipulator
  this.origin = origin;
  this.tipPos;
  this.isLeft = isLeft;

  // recalculate the position of the end effector (fingertip)
  this.recalcManipulator = function(jointAngles)
  {
    var pointPositions = new Array(jointAngles+1);
    // start at the origin
    var T = Trans(this.origin.v[0], this.origin.v[1], this.origin.v[2]);
    // then rotate the origin so that each joint rotates around the z axis
    T.multiplyByMatrix(RotY(-Math.PI/2));
    T.multiplyByMatrix(RotZ(jointAngles[0]));
    pointPositions[0] = T.getPos();

    T.multiplyByMatrix(RotX(-Math.PI/2));

    // apply the joint angle rotations to each joint
    var A;
//    var dVals = [0, 10, 15, 10];
    var dVals = [0, 0, 0, 0];
    pointPositions[1] = T.getPos();
    for (var j = 1; j < jointAngles.length; ++j)
    {
      if (isLeft)
      {
        A = MultiplyMatrices(RotZ(jointAngles[j]), Trans(0,0,dVals[j-1]));
      }
      else
      {
        A = MultiplyMatrices(RotZ(-jointAngles[j]), Trans(0,0,dVals[j-1]));
      }
      A.multiplyByMatrix(Trans(heights[j],0,0));
      T.multiplyByMatrix(A);
      pointPositions[j+1] = T.getPos();
    }

    // finish with the final positions
    this.tipPos = T.getPos();
    return pointPositions;
  }

  this.getPos = function()
  {
    return this.tipPos;
  }
}
