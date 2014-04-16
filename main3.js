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

Tree.prototype.simplifyPerson = function(person) {
	// Can't simplify person if person does not have any prevs or nexts
	if ((!person.hasPrevs()) || (!person.hasNexts())) {
		console.log("Can't simplify!")
		return;
	}
	console.log("Can simplify something!");
}

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

//--------------------------------------------------------------------------------------------------------

var bob = new Person("Bob");
var jennifer = new Person("Jennifer");
var tom = new Person("Tom");
var diane = new Person("Diane");
var jordan = new Person("Jordan");

var tree = new Tree();
tree.addPerson(bob);
tree.addPerson(jennifer);
tree.addPerson(tom);
tree.addPerson(diane);
tree.addPerson(jordan);

console.log("******** Testing addConnection ********");

tree.addConnection(jennifer, bob, 1);
tree.addConnection(tom, bob, 1);
tree.addConnection(diane, bob, 1);
tree.addConnection(bob, jordan, 10);
tree.listConnections();

console.log("******** Testing removeConnection ********");

tree.removeConnection(bob, jordan);
tree.listConnections();

console.log("******** Testing simplifyPerson ********");

tree.addConnection(bob, jordan, 10);
tree.simplifyPerson(bob);

console.log("******** Testing simplifyPerson ********");

tree.addConnection(bob, jordan, 10);
tree.removeConnection(bob, jordan);
tree.simplifyPerson(bob);

console.log("******** Testing simplifyPerson ********");

tree.addConnection(bob, jordan, 10);
tree.simplifyPerson(bob);

