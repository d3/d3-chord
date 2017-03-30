import {slice} from "./array";
import constant from "./constant";
import {cos, halfPi, sin} from "./math";
import {path} from "d3-path";

function defaultSource(d) {
  return d.source;
}

function defaultTargets(d) {
  return d.targets;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

export default function() {
  var source = defaultSource,
      targets = defaultTargets,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null,
      // Used to pull the ribbon towards the center, giving the ribbon the appearance of being pulled towards the center
      controlPointX = 0,
      centerPointX = 0,
      controlPointY = 0,
      centerPointY = 0;

  function multiribbon() {
    var buffer,
        argv = slice.call(arguments),
        // source
        s = source.apply(this, argv),
        // targets
        ts = targets.apply(this, argv),

        // source radius
        sr = +radius.apply(this, (argv[0] = s, argv)),

        // source start angle
        sa0 = startAngle.apply(this, argv) - halfPi,    

        // source end angle
        sa1 = endAngle.apply(this, argv) - halfPi,

        // source x
        sx0 = sr * cos(sa0),

        // source y
        sy0 = sr * sin(sa0);

    // create a path instance to start constructing the path's d attribute
    if (!context) context = buffer = path();

    //start at a point
    context.moveTo(sx0, sy0);

    // draw the circular arc for the source element
    context.arc(centerPointX, centerPointY, sr, sa0, sa1);                                                          

    // For each item in the targets
    ts.map(function (t) {

      // target radius
      var tr = +radius.apply(this, (argv[0] = t, argv)),

      // target start angle
      ta0 = startAngle.apply(this, argv) - halfPi,

      // target end angle
      ta1 = endAngle.apply(this, argv) - halfPi;

      // If the source and target are the same, then we skip drawing the curve and arc,
      // otherwise it will end up being drawn twice
      //
      if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
        // draw the quadratic curve to the target element's x and y coordinates
        context.quadraticCurveTo(controlPointX, controlPointY, tr * cos(ta0), tr * sin(ta0));
        // draw the circular arc for the target element
        context.arc(centerPointX, centerPointY, tr, ta0, ta1);                                  
      }
    });

    // draw the quadratic curve to the source element's x and y coordinates
    context.quadraticCurveTo(controlPointX, controlPointY, sx0, sy0);                         

    // Once all of the path points are plotted, close the path.
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  multiribbon.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), multiribbon) : radius;
  };

  multiribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), multiribbon) : startAngle;
  };

  multiribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), multiribbon) : endAngle;
  };

  multiribbon.source = function(_) {
    return arguments.length ? (source = _, multiribbon) : source;
  };

  multiribbon.targets = function(_) {
    return arguments.length ? (targets = _, multiribbon) : targets;
  };

  multiribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), multiribbon) : context;
  };

  return multiribbon;
}
