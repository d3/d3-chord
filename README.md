# d3-chord

Visualize relationships or network flow with an aesthetically-pleasing circular layout.

## Installing

If you use NPM, `npm install d3-chord`. Otherwise, download the [latest release](https://github.com/d3/d3-chord/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-chord.v0.0.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-path.v1.min.js"></script>
<script src="https://d3js.org/d3-chord.v0.0.min.js"></script>
<script>

var chord = d3.chord();

</script>
```

[Try d3-chord in your browser.](https://tonicdev.com/npm/d3-chord)

## API Reference

<a href="#chord" name="chord">#</a> d3.<b>chord</b>()

…

<a href="#_chord" name="_chord">#</a> <i>chord</i>(<i>matrix</i>)

…

<a href="#chord_padAngle" name="#chord_padAngle">#</a> <i>chord</i>.<b>padAngle</b>([<b>angle</b>])

…

<a href="#chord_sortGroups" name="#chord_sortGroups">#</a> <i>chord</i>.<b>sortGroups</b>([<b>compare</b>])

…

<a href="#chord_sortSubgroups" name="#chord_sortSubgroups">#</a> <i>chord</i>.<b>sortSubgroups</b>([<b>compare</b>])

…

<a href="#chord_sortChords" name="#chord_sortChords">#</a> <i>chord</i>.<b>sortChords</b>([<b>compare</b>])

…

<a href="#ribbon" name="ribbon">#</a> d3.<b>ribbon</b>()

…

<a href="#_ribbon" name="_ribbon">#</a> <i>ribbon</i>(<i>arguments…</i>)

…

<a href="#ribbon_source" name="ribbon_source">#</a> <i>ribbon</i>.<b>source</b>([<i>source</i>])

…

```js
function source(d) {
  return d.source;
}
```

<a href="#ribbon_target" name="ribbon_target">#</a> <i>ribbon</i>.<b>target</b>([<i>target</i>])

…

```js
function target(d) {
  return d.target;
}
```

<a href="#ribbon_radius" name="ribbon_radius">#</a> <i>ribbon</i>.<b>radius</b>([<i>radius</i>])

…

```js
function radius(d) {
  return d.radius;
}
```

<a href="#ribbon_startAngle" name="ribbon_startAngle">#</a> <i>ribbon</i>.<b>startAngle</b>([<i>startAngle</i>])

…

```js
function startAngle(d) {
  return d.startAngle;
}
```

<a href="#ribbon_endAngle" name="ribbon_endAngle">#</a> <i>ribbon</i>.<b>endAngle</b>([<i>endAngle</i>])

…

```js
function endAngle(d) {
  return d.endAngle;
}
```

<a href="#ribbon_context" name="ribbon_context">#</a> <i>ribbon</i>.<b>context</b>([<i>context</i>])

… See [d3-path](https://github.com/d3/d3-path).
