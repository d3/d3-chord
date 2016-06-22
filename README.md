# d3-chord

Visualize relationships or network flow with an aesthetically-pleasing circular layout.

[<img alt="Chord Diagram" src="https://raw.githubusercontent.com/d3/d3-chord/master/img/chord.png" width="480" height="480">](http://bl.ocks.org/mbostock/4062006)

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

Constructs a new chord layout.

<a href="#_chord" name="_chord">#</a> <i>chord</i>(<i>matrix</i>)

Computes the chord layout for the specified square *matrix* of size *n*×*n*. In other words, the given *matrix* must be an array of length *n* where each element *matrix*[*i*] is an array of *n* numbers. From the [Circos tableviewer example](http://mkweb.bcgsc.ca/circos/guide/tables/):

```js
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];
```

The number *matrix*[*i*][*j*] represents to the amount of flow from the *i*th element to the *j*th element; the number *matrix*[*j*][*i*] represents the reverse flow from the *j*th element to the *i*th element. The return value of *chord*(*matrix*) is an array of *chords*, where each chord is an object with the following properties:

* `startAngle` - the start angle in radians
* `endAngle` - the end angle in radians
* `value` - the flow value *matrix*[*i*][*j*]
* `index` - the source index *i*
* `subindex` - the target index *j*

The chords are typically passed to [d3.ribbon](#ribbon) to display the asymmetric flow between elements.

The *chords* array defines a second array, *chords*.groups, where each group is an object with the following properties:

* `startAngle` - the start angle in radians
* `endAngle` - the end angle in radians
* `value` - the total outgoing flow value *matrix*[*i*][0 … *n* - 1]
* `index` - the source index *i*

The groups are typically passed to [d3.arc](https://github.com/d3/d3-shape#arc) to produce a donut chart around the circumference of the chord layout.

<a href="#chord_padAngle" name="#chord_padAngle">#</a> <i>chord</i>.<b>padAngle</b>([<i>angle</i>])

…

<a href="#chord_sortGroups" name="#chord_sortGroups">#</a> <i>chord</i>.<b>sortGroups</b>([<i>compare</i>])

…

<a href="#chord_sortSubgroups" name="#chord_sortSubgroups">#</a> <i>chord</i>.<b>sortSubgroups</b>([<i>compare</i>])

…

<a href="#chord_sortChords" name="#chord_sortChords">#</a> <i>chord</i>.<b>sortChords</b>([<i>compare</i>])

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
