//--------------------------------------------------------------------------------------------------------

function Tree() {
	this.persons = [];
}

Tree.prototype.addPerson = function(person) {
	this.persons.push(person);
};

// Order of the parameters matter. debtor owes creditor amount.
Tree.prototype.addConnection = function(debtor, creditor, amount) {
	// Can't add a debt of 0
	if (amount == 0) {
		return;
	}
	
	// Check if person1 already owes person2 an amount. In other words, check if person1 already has a connection to person 2. If true, then add on the amount.
	var creditorNextIndex = debtor.nextIndex(creditor);
	var debtorPrevIndex = creditor.prevIndex(debtor);
	if ((creditorNextIndex != -1) && (debtorPrevIndex != -1)) {
		var creditorNext = debtor.nexts[creditorNextIndex];
		var debtorPrev = creditor.prevs[debtorPrevIndex];

		creditorNext[1] += amount;
		debtorPrev[1] += amount;
	} else {
		var debtorNexts = debtor.nexts;
		var creditorPrevs = creditor.prevs;
		
		debtorNexts.push([creditor, amount]);
		creditorPrevs.push([debtor, amount]);
	}
};

// Order of the parameters matter. debtor owes creditor amount.
Tree.prototype.removeConnection = function(debtor, creditor) {
	var creditorNextIndex = debtor.nextIndex(creditor);
	var debtorPrevIndex = creditor.prevIndex(debtor);
	if ((creditorNextIndex != -1) && (debtorPrevIndex != -1)) {
		var creditorNexts = debtor.nexts
		var debtorPrevs = creditor.prevs;

		creditorNexts.splice(creditorNextIndex, 1);
		debtorPrevs.splice(debtorPrevIndex, 1);
	}
};

// For any person
Tree.prototype.simplifyPerson = function(person) {
	// Can't simplify person if person does not have any prevs or nexts
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify!");
		return;
	}

	// At this point, there is at least debtor and one creditor
	console.log("Can simplify something!");
	
	// Simplify all exacts
	this.simplifyExacts(person);
	
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify anymore!!");
		return;
	}
	
	// At this point, the person can still be simplified
	console.log("Can still simplify!");
	
	this.simplifyPerfectSubsetSums(person);
	
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify anymore!!");
		return;
	}
	
	// At this point, the person can still be simplified
	console.log("Can still simplify!");
	
	
	this.simplifySubsetSums(person);
	
	if (!this.canSimplifyPerson(person)) {
		console.log("Can't simplify anymore!!");
		return;
	}
	
	// At this point, the person can still be simplified
	console.log("Can still simplify!");

	
	
};

Tree.prototype.canSimplifyPerson = function(person) {
	if ((!person.hasPrevs()) || (!person.hasNexts())) {
		return false;
	}
	return true;
};

// Simplify each person until no one has both debtors and creditors
Tree.prototype.simplifyTree = function() {	
};

// Simplify exact debts
Tree.prototype.simplifyExacts = function(person) {
	var nexts = person.nexts;
	for (var i = 0; i < nexts.length; i++) {
		var next = nexts[i];
		var creditor = next[0];
		var amount = next[1];
		
		var exactDebtor = person.prevAmountPerson(amount);
		
		if (exactDebtor != null) {
			console.log("Exact debtor found!");
			this.removeConnection(exactDebtor, person);
			this.removeConnection(person, creditor);
			this.addConnection(exactDebtor, creditor, amount);
			i -= 1;
		}
	}
};

Tree.prototype.simplifyPerfectSubsetSums = function(person) {
	var nexts = person.nexts;
	for (var i = 0; i < nexts.length; i++) {
		var next = nexts[i];
		var creditor = next[0];
		var amount = next[1];
		
		var prevSubsets = this.prevSubsets(person);
		var prevSubsetsSums = this.prevSubsetsSums(prevSubsets);
	
		console.log("Subsets: " + prevSubsets);
		console.log("Subset sums " + prevSubsetsSums);
				
		var matchIndex = this.prevSubsetsSumsMatchIndex(prevSubsetsSums, amount);
		if (matchIndex != -1) {
			var matchedSubset = prevSubsets[matchIndex];
			console.log("Match subset found: " + matchedSubset);
			this.moveAllMatches(matchedSubset, person, creditor);
			i -= 1;
		}
	}
};

Tree.prototype.simplifySubsetSums = function(person) {
	var nexts = person.nexts;
	for (var i = 0; i < nexts.length; i++) {
		var next = nexts[i];
		var creditor = next[0];
		var amount = next[1];
		
		var prevSubsets = this.prevSubsets(person);
		var prevSubsetsSums = this.prevSubsetsSums(prevSubsets);
	
		console.log("Subsets: " + prevSubsets);
		console.log("Subset sums " + prevSubsetsSums);
				
		var matchIndex = this.prevSubsetsSumsMatchIndex2(prevSubsetsSums, amount);
		if (matchIndex != -1) {
			var matchedSubset = prevSubsets[matchIndex];
			console.log("Match subset found: " + matchedSubset);
			return;
			i -= 1;
		}
	}
};

Tree.prototype.listConnections = function() {
	var persons = this.persons;
	console.log("------------------------")
	for (var i = 0; i < persons.length; i++) {
		var person = persons[i];
		console.log("*For " + person.name + ":*");
		this.listPrevs(person);
		this.listNexts(person);
		console.log("------------------------")
	}
};

Tree.prototype.listPrevs = function(creditor) {
	var prevs = creditor.prevs;
	for (var i = 0; i < prevs.length; i++) {
		var prev = prevs[i];
		var debtor = prev[0];
		var amount = prev[1];
		console.log(creditor.name + " is owed $" + amount + " from " + debtor.name);
	}
};

Tree.prototype.listNexts = function(debtor) {
	var nexts = debtor.nexts;
	for (var i = 0; i < nexts.length; i++) {
		var next = nexts[i];
		var creditor = next[0];
		var amount = next[1];
		console.log(debtor.name + " owes $" + amount + " to " + creditor.name);
	}
};

// Return an array of all debtor subsets
Tree.prototype.prevSubsets = function(person) {
	var prevs = person.prevs;
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

Tree.prototype.prevSubsetsSums = function(subsets) {
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

Tree.prototype.prevSubsetsSumsMatchIndex = function(sums, amount) {
	for (var i = 0; i < sums.length; i++) {
		var sum = sums[i];
		if (sum == amount) {
			return i;
		}
	}
	return -1;
};

Tree.prototype.prevSubsetsSumsMatchIndex2 = function(sums, amount) {
	var maxSum = 0;
	var maxIndex = 0;
	for (var i = 0; i < sums.length; i++) {
		var sum = sums[i];
		if ((sum > maxSum) && (sum < amount)) {
			maxSum = sum;
			maxIndex = i;
		}
	}
	if (maxSum != 0) {
		return maxIndex;
	}
	return -1;
};

Tree.prototype.moveAllMatches = function(matchedSubset, debtor, creditor) {
	this.removeConnection(debtor, creditor);
	for (var i = 0; i < matchedSubset.length; i++) {
		var prev = matchedSubset[i];
		var prevDebtor = prev[0];
		var amount = prev[1];
		this.removeConnection(prevDebtor, debtor);
		this.addConnection(prevDebtor, creditor, amount);
	}
}

//--------------------------------------------------------------------------------------------------------

function Person(name) {
	this.name = name;
	this.prevs = [];
	this.nexts = [];
}

// If person exists in this.nexts, return the index of it. Otherwise, return false.
Person.prototype.nextIndex = function(person) {
	var nexts = this.nexts;
	for (var i = 0; i < nexts.length; i++) {
		var next = nexts[i];
		var creditor = next[0];
		if (creditor.name == person.name) {
			return i;
		}
	}
	return -1;
};

// If person exists in this.prevs, return the index of it. Otherwise, return false.
Person.prototype.prevIndex = function(person) {
	var prevs = this.prevs;
	for (var i = 0; i < prevs.length; i++) {
		var prev = prevs[i];
		var debtor = prev[0];
		if (debtor.name == person.name) {
			return i;
		}
	}
	return -1;
};

Person.prototype.hasPrevs = function() {
	var prevs = this.prevs;
	return (prevs.length != 0)
};

Person.prototype.hasNexts = function() {
	var nexts = this.nexts;
	return (nexts.length != 0)
};

// If there is a debtor who owes you exactly equal to amount, return that debtor. Otherwise, return null.
Person.prototype.prevAmountPerson = function(amount) {
	var prevs = this.prevs;
	for (var i = 0; i < prevs.length; i++) {
		var prev = prevs[i];
		var debtor = prev[0];
		var debtorAmount = prev[1];
		if (debtorAmount == amount) {
			return debtor;
		}
	}
	return null;
};

//--------------------------------------------------------------------------------------------------------

var bob = new Person("Bob");
var jennifer = new Person("Jennifer");
var tom = new Person("Tom");
var diane = new Person("Diane");
var jordan = new Person("Jordan");
var kevin = new Person("Kevin");
var mike = new Person("Mike");
var kate = new Person("Kate");
var albert = new Person("Albert");

var tree = new Tree();
tree.addPerson(bob);
tree.addPerson(jennifer);
tree.addPerson(tom);
tree.addPerson(diane);
tree.addPerson(jordan);
tree.addPerson(kevin);
tree.addPerson(kate);
tree.addPerson(mike);
tree.addPerson(albert);

tree.addConnection(jennifer, bob, 1);
tree.addConnection(tom, bob, 2);
tree.addConnection(diane, bob, 1);
tree.addConnection(bob, jordan, 1);
tree.addConnection(bob, kevin, 3);

tree.addConnection(kate, bob, 5);
tree.addConnection(bob, mike, 20);
tree.addConnection(albert, bob, 10)

tree.simplifyPerson(bob);
tree.listConnections();


