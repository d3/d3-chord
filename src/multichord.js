import {range} from "d3-array";
import {max, tau} from "./math";

function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

export default function() {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function multichord(matrix) {
		// The matrix isn't n x n, but instead a list of groups
		// that individually need to be constructed.
    var n = matrix[0].length,
				// Where the group sums are stored
        groupSums = [],
				/* Creates an array with which goes from 0 - no. groups, in increments
				of 1 */
        groupIndex = range(n),
				/* Used to help track what sums to add up inside of the array, in
				accordance with the mirror nature of a matrix */
        subgroupIndex = [],
				// This is used to store the chords that need to be drawn
        chords = [],
				// This is used to store the groups that need to be drawn
        groups = chords.groups = new Array(n),
				// This is used to store the number of subgroups to draw
        subgroups = new Array(matrix.length * n),
				// k is used to store the sum of all of the groups
        k,
				// x is used to used to store the sum of a group
        x,
				// Q - What is this used for?
        dx,
				// Q - What is this used for?
        i,
				// Q - What is this used for?
        j;

    // Compute the sum.
    k=0;i = -1; while (++i < n) {
      x = 0, j = -1; while (++j < n) {
        x += matrix[i][j];
      }
      subgroupIndex.push(range(n));
    }

		// k | the total sum of all the groups
		//
		const sum = function (a,b) { return a + b };
		k = [].concat.apply([],matrix).reduce(sum, 0);

		// groupSums | the group sums
		range(n).map(function (iterator) {
			const counts = matrix.map(function(list) { return list[iterator]; });
			groupSums.push(counts.reduce(sum,0));
		});

    // Sort groups…
    if (sortGroups) groupIndex.sort(function(a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    });

    // Sort subgroups…
    if (sortSubgroups) subgroupIndex.forEach(function(d, i) {
      d.sort(function(a, b) {
        return sortSubgroups(matrix[i][a], matrix[i][b]);
      });
    });

    // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?
		/*
			k is the sum of all of the groups.
			It is then reassigned as the max value of tau minus the padAngle
			multiplied by the number of
			groups, then divided by the value of k
		*/
    k = max(0, tau - padAngle * n) / k;

		/* if k > 0, then dx is the padAngle, or it is tau dividued by the number of
		groups */
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!

		/*
			x is a variable to track the startAngle and endAngle values whilst each
			item in the matrix is analyzed

			i and j are iterator variables

			x0 track the startAngle for the group
			di is the group index
			dj is the sub group index

			a0 is the value x, the start angle
			a1 is the value of x plus the value multiplied by k. This produces the
			radians for the end angle.

		*/

    x = 0, i = -1; while (++i < n) {
      j = -1; while (++j < n) {
        var di = groupIndex[i],
            dj = subgroupIndex[di][j],
            v = matrix[di][dj],
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

			/* At the end, the pad angle radians is added too */
      x += dx;
    }

		// Construct the radians for the groups
		var currentX = 0;
		groupSums.map(function (groupSum, i) {
			var oldX = currentX;
			currentX += groupSum * k;
			groups[i] = {
				index: i,
				startAngle: oldX,
				endAngle: currentX,
				value: groupSum
			};
			currentX += dx;
		});


		var superGroups = [];

		var calculateAngle = function(value, index, subindex) {
			if (superGroups.length === 0) {
				return {
					index: index,
					subindex: subindex,
					startAngle: groups[subindex].startAngle,
					endAngle: groups[subindex].startAngle + value * k,
					value: value
				};
			} else {
				return {
					index: index,
					subindex: subindex,
					startAngle: superGroups[index-1][subindex].endAngle,
					endAngle: superGroups[index-1][subindex].endAngle + value * k,
					value: value
				};
			}
		};

		// Construct the radians for the subgroups
		matrix.map(function(list, index) {
			var superGroup = list.map(function (value, subindex) { return calculateAngle(value, index, subindex); });
			superGroups.push(superGroup);
		});


		superGroups.map(function(superGroup) {
			superGroup = superGroup.filter(function (item) {return item.value > 0;});
			if (superGroup.length > 1) {
				chords.push({
					source: superGroup[0],
					targets: superGroup.slice(1)
				});
			}
		});

    return sortChords ? chords.sort(sortChords) : chords;
  }

  multichord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), multichord) : padAngle;
  };

  multichord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, multichord) : sortGroups;
  };

  multichord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, multichord) : sortSubgroups;
  };

  multichord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, multichord) : sortChords && sortChords._;
  };

  return multichord;
}
