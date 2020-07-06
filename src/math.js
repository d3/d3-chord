export var abs = Math.abs;
export var cos = Math.cos;
export var sin = Math.sin;
export var pi = Math.PI;
export var halfPi = pi / 2;
export var tau = pi * 2;
export var max = Math.max;
export function angularDistance(a, b) {
  return 1 - abs((abs(a - b) / pi) % 2 - 1);
}