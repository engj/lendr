function Tree() {
	this.persons = [];
}

Tree.prototype.addPerson = function(person) {
	this.persons[person.name] = person;
};

Tree.prototype.addConnection = function(debtor, creditor, amount) {
	debtor.addNext(creditor, amount);
	creditor.addPrev(debtor, amount);
};

Tree.prototype.removeConnection = function(debtor, creditor) {
	debtor.removeNext(creditor);
	creditor.removePrev(debtor);
};

Tree.prototype.listConnections = function() {
	var persons = _.values(this.persons);
	for (var i = 0; i < persons.length; i++) {
		console.log("----" + persons[i].name + "'s nexts:");
		console.log(persons[i].nexts);
		console.log("----" + persons[i].name + "'s prevs:");
		console.log(persons[i].prevs);
		console.log(" ");
	}
};

Tree.prototype.canSimplifyPerson = function(person) {
	if ((_.size(person.nexts) == 0) || (_.size(person.prevs) == 0)) {
		return false;
	}
	return true;
}

Tree.prototype.simplifyPerson = function(person) {
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify person!");
		return;
	} else {
		console.log("Can still simplify person!");
	}
	
	this.simplifyOneToOne(person);
	
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify person!");
		return;
	} else {
		console.log("Can still simplify person!");
	}
	
	this.simplifyPerfectSums(person);
	
};

Tree.prototype.simplifyOneToOne = function(person) {
	var nexts = _.keys(person.nexts);
	var nextamounts = _.values(person.nexts);
	
	var prevs = _.keys(person.prevs);
	var prevamounts = _.values(person.prevs);
	
	for (var i = 0; i < nextamounts.length; i++) {
		var match = _.indexOf(prevamounts, nextamounts[i]);
		if (match != -1) {
			var debtor = this.persons[prevs[match]];
			var creditor = this.persons[nexts[i]];
			console.log("match found: " + debtor.name);
			this.removeConnection(debtor, person);
			this.removeConnection(person, creditor);
			this.addConnection(debtor, creditor, nextamounts[i]);
			i -= 1;
		} else {
			console.log("match not found");
		}
	}
};

Tree.prototype.generateSubsets = function(person) {
	var prevs = _.pairs(person.prevs);
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
	return subsets;
};

Tree.prototype.subsetSums = function(subsets) {
	var sums = [];
	for (var i = 0; i < subsets.length; i++) {
		var sum = 0;
		for (var j = 0; j < subsets[i].length; j++) {
			sum += subsets[i][j][1];
		}
		sums.push(sum);
	}
	return sums;
};

Tree.prototype.simplifyPerfectSums = function(person) {
	var subsets = this.generateSubsets(person);
	var sums = this.subsetSums(subsets);

};
