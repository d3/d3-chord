var tape = require("tape"),
    d3_chord = require("../");

tape("d3.ribbon()", function(test) {
  test.ok(d3_chord.ribbon());
  test.end();
});
