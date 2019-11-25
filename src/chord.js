import {max, tau} from "./math.js";

function range(i, j) {
  return Array.from({length: j - i}, (_, k) => i + k);
}

function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

export default function() {
  return chord(false);
}

export function chordDirected() {
  return chord(true);
}

function chord(directed) {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function chord(matrix) {
    var n = matrix.length,
        groupSums = new Array(n),
        groupIndex = range(0, n),
        chords = new Array(n * n),
        groups = new Array(n),
        k = 0, dx;

    // Compute the scaling factor from value to angle in [0, 2pi].
    for (let i = 0; i < n; ++i) {
      let x = 0;
      for (let j = 0; j < n; ++j) x += matrix[i][j] + directed * matrix[j][i];
      k += groupSums[i] = x;
    }
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the angles for each group and constituent chord.
    {
      let x = 0;
      if (sortGroups) groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
      for (const i of groupIndex) {
        const x0 = x;
        if (directed) {
          const subgroupIndex = range(~n + 1, n).filter(j => j < 0 ? matrix[~j][i] : matrix[i][j]);
          if (sortSubgroups) subgroupIndex.sort((a, b) => sortSubgroups(a < 0 ? -matrix[~a][i] : matrix[i][a], b < 0 ? -matrix[~b][i] : matrix[i][b]));
          for (const j of subgroupIndex) {
            if (j < 0) {
              const chord = chords[~j * n + i] || (chords[~j * n + i] = {source: null, target: null, value: null});
              chord.target = {index: i, startAngle: x, endAngle: x += matrix[~j][i] * k};
            } else {
              const chord = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null, value: null});
              chord.source = {index: i, startAngle: x, endAngle: x += matrix[i][j] * k};
              chord.value = matrix[i][j];
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i], sourceValue: matrix[i].reduce((p, v) => p + v, 0), targetValue: matrix.reduce((p, v) => p + v[i], 0)};
        } else {
          const subgroupIndex = range(0, n).filter(j => matrix[i][j] || matrix[j][i]);
          if (sortSubgroups) subgroupIndex.sort((a, b) => sortSubgroups(matrix[i][a], matrix[i][b]));
          for (const j of subgroupIndex) {
            if (i < j) {
              const chord = chords[i * n + j] || (chords[i * n + j] = {source: null, target: null});
              chord.source = {index: i, startAngle: x, endAngle: x += matrix[i][j] * k, value: matrix[i][j]};
            } else {
              const chord = chords[j * n + i] || (chords[j * n + i] = {source: null, target: null});
              chord.target = {index: i, startAngle: x, endAngle: x += matrix[i][j] * k, value: matrix[i][j]};
              if (i === j) chord.source = chord.target;
            }
          }
          groups[i] = {index: i, startAngle: x0, endAngle: x, value: groupSums[i]};
        }
        x += dx;
      }
    }

    // Remove empty chords.
    chords = chords.filter(x => x); // XXX
    chords.groups = groups;
    return sortChords ? chords.sort(sortChords) : chords;
  }

  chord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
  };

  chord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  chord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}
