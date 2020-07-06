import {slice} from "./array.js";
import constant from "./constant.js";
import {abs, angularDistance, cos, halfPi, sin} from "./math.js";
import {path} from "d3-path";

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
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
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbon() {
    var buffer,
        argv = slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        sx0 = sr * cos(sa0),
        sy0 = sr * sin(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = path();

    // evaluate angles for the 2 Bezier parts so we know which one is "inner"
    // D0 D1 are the distances. The largest is "outer"
    // the inner angle should shrink a little, depending
    // on whether it can hurt the outer.
    var D0 = angularDistance(sa0, ta1),
        D1 = angularDistance(sa1, ta0),
        inner = Math.pow(abs(D0 - D1) + (1 - D0) * (1 - D1), 6) * tr / 4;

    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1);
    if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
      context.quadraticCurveTo(
        D0 > D1 && inner * (cos(sa1) + cos(ta0)),
        D0 > D1 && inner * (sin(sa1) + sin(ta0)),
        tr * cos(ta0),
        tr * sin(ta0)
      );
      context.arc(0, 0, tr, ta0, ta1);
    }
    context.quadraticCurveTo(
      D0 < D1 && inner * (cos(sa0) + cos(ta1)),
      D0 < D1 && inner * (sin(sa0) + sin(ta1)),
      sx0,
      sy0
    );
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  ribbon.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbon) : radius;
  };

  ribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : endAngle;
  };

  ribbon.source = function(_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
  };

  return ribbon;
}
