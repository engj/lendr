function Tree() {
	this.persons = [];
}

Tree.prototype.addPerson = function(person) {
	this.persons.push(person);
};

Tree.prototype.simplify = function() {
	for (var i = 0; i < this.persons.length; i++) {
		this.persons[i].simplify();
	}
};

Tree.prototype.printConnections = function() {
	console.log("---");
	this.printNexts();
	console.log(" ");
	this.printPrevs();
	console.log("---")
};

Tree.prototype.printNexts = function() {
	for (var i = 0; i < this.persons.length; i++) {
		var person = this.persons[i];
		var nexts = person.nexts;
		for (var j = 0; j < nexts.length; j++) {
			var next = nexts[j];
			console.log(person.name + " owes $" + next[1] + " to " + next[0].name);
		}
	}
};

Tree.prototype.printPrevs = function() {
	for (var i = 0; i < this.persons.length; i++) {
		var person = this.persons[i];
		var prevs = person.prevs;
		for (var j = 0; j < prevs.length; j++) {
			var prev = prevs[j];
			console.log(person.name + " is owed $" + prev[1] + " from " + prev[0].name);
		}
	}
};

function Person(name) {
	this.name = name;
	this.nexts = [];
	this.prevs = [];
}

Person.prototype.addNext = function(creditor, amount) {
	if (amount == 0) {
		return;
	}
	var nextIndex = this.nextIndex(creditor);
	var prevIndex = creditor.prevIndex(this);
	if ((nextIndex == -1) && (prevIndex == -1)) {
		this.nexts.push([creditor, amount]);
		creditor.prevs.push([this, amount]);
	} else {
		this.nexts[nextIndex][1] += amount;
		creditor.prevs[prevIndex][1] += amount;
	}
};

Person.prototype.simplify = function() {
	while (this.canSimplify()) {
		var next = this.nexts[0];
		var prev = this.prevs[0];
		this.simplifyConnection(next, prev);
	}
};

Person.prototype.simplifyConnection = function(next, prev) {
	var creditor = next[0];
	var creditorAmount = next[1];
	
	var debtor = prev[0];
	var debtorAmount = prev[1];
	
	debtor.removeNext(this);
	this.removePrev(debtor);
	
	this.removeNext(creditor);
	creditor.removePrev(this);
	
	if (creditorAmount == debtorAmount) {
		debtor.addNext(creditor, creditorAmount);
	} else if (creditorAmount > debtorAmount) {
		debtor.addNext(creditor, debtorAmount);
		this.addNext(creditor, creditorAmount - debtorAmount);
	} else {
		debtor.addNext(creditor, creditorAmount);
		debtor.addNext(this, debtorAmount - creditorAmount);
	}
};

Person.prototype.removeNext = function(creditor) {
	var nextIndex = this.nextIndex(creditor);
	this.nexts.splice(nextIndex, 1);
};

Person.prototype.removePrev = function(debtor) {
	var prevIndex = this.prevIndex(debtor);
	this.prevs.splice(prevIndex, 1);
};

Person.prototype.canSimplify = function() {
	if ((this.nexts.length == 0) || (this.prevs.length == 0)) {
		return false;
	}
	return true;
};

Person.prototype.nextIndex = function(creditor) {
	for (var i = 0; i < this.nexts.length; i++) {
		if (this.nexts[i][0].name == creditor.name) {
			return i;
		}
	}
	return -1;
};

Person.prototype.prevIndex = function(debtor) {
	for (var i = 0; i < this.prevs.length; i++) {
		if (this.prevs[i][0].name == debtor.name) {
			return i;
		}
	}
	return -1;
};

var a = new Person("A");
var b = new Person("B");
var c = new Person("C");
var d = new Person("D");
var f = new Person("F");
var e = new Person("E");

var tree = new Tree();

tree.addPerson(a);
tree.addPerson(b);
tree.addPerson(c);
tree.addPerson(d);
tree.addPerson(f);
tree.addPerson(e);

a.addNext(b, 20);
d.addNext(b, 5);
b.addNext(c, 10);
b.addNext(f, 1);
f.addNext(e, 5);

tree.simplify();

tree.printConnections();
