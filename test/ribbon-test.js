var tape = require("tape"),
    d3 = require("../");

tape("d3.ribbon()", function(test) {
  test.ok(d3.ribbon());
  test.end();
});
