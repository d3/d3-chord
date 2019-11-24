import {max, tau} from "./math.js";

function range(n) {
  return Array.from({length: n}, (_, i) => i);
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
        groupSums = [],
        groupIndex = range(n),
        subgroupIndex = [],
        chords = [],
        groups = chords.groups = new Array(n),
        subgroups = new Array(n * n),
        k,
        x,
        x0,
        dx,
        i,
        j;

    // Compute the sum.
    k = 0, i = -1; while (++i < n) {
      x = 0, j = -1; while (++j < n) {
        x += matrix[i][j] + directed * matrix[j][i];
      }
      groupSums.push(x);
      subgroupIndex.push(range(n));
      k += x;
    }

    // Sort.
    if (sortGroups) groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
    if (sortSubgroups) subgroupIndex.forEach((d, i) => d.sort((a, b) => sortSubgroups(matrix[i][a], matrix[i][b])));

    // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    x = 0, i = -1; while (++i < n) {
      x0 = x, j = -1; while (++j < n) {
        var di = groupIndex[i],
            dj = subgroupIndex[di][j],
            v = matrix[di][dj] + directed * matrix[dj][di],
            a0 = x,
            a1 = x += v * k;
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      x += dx;
    }

    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1; while (++i < n) {
      j = i - 1; while (++j < n) {
        var source = subgroups[j * n + i],
            target = subgroups[i * n + j],
            sourceValue = matrix[i][j],
            targetValue = matrix[j][i];
        if (directed) {
          var t = sourceValue / (sourceValue + targetValue);
          if (sourceValue) {
            chords.push({
              source: {
                index: i,
                startAngle: source.startAngle * t + source.endAngle * (1 - t),
                endAngle: source.startAngle * (1 - t) + source.endAngle * t
              },
              target: {
                index: j,
                startAngle: target.startAngle * t + target.endAngle * (1 - t),
                endAngle: target.startAngle * (1 - t) + target.endAngle * t
              },
              value: sourceValue
            });
          }
          if (targetValue) {
            chords.push({
              source: {
                index: j,
                startAngle: target.startAngle * (1 - t) + target.endAngle * t,
                endAngle: target.startAngle * t + target.endAngle * (1 - t)
              },
              target: {
                index: i,
                startAngle: source.startAngle * (1 - t) + source.endAngle * t,
                endAngle: source.startAngle * t + source.endAngle * (1 - t)
              },
              value: targetValue
            });
          }
        } else if (sourceValue || targetValue) {
          chords.push(sourceValue < targetValue
              ? {source: target, target: source}
              : {source: source, target: target});
        }
      }
    }

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
