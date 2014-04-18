console.log("SDads");

var prevs = [[1],[3],[2]]
//console.log(prevs);

var subsets = [];
for (var i = 0; i < prevs.length; i++) {
	subsets.push([prevs[i]]);
	var subsetslength = subsets.length;
	for (var j = 0; j < subsetslength - 1; j++) {
		var subset = [];
		for (var k = 0; k < subsets[j].length; k++) {
			subset.push(subsets[j][k]);
		}
		subset.push(prevs[i]);
		subsets.push(subset);
	}	
}

var sums = [];
for (var i = 0; i < subsets.length; i++) {
	var sum = 0;
	for (var j = 0; j < subsets[i].length; j++) {
		sum += subsets[i][j][0];
	}
	sums.push(sum);
}

console.log(sums);