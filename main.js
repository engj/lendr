console.log("ASdasd");

function Person(name) {
	this.name = name;
	this.nexts = [];
	this.previouses = [];
	
	this.addNext = function(person, amount) {
		// Is there a perfect previous?
		perfectPrevious = this.perfectPrevious(amount);
		if (perfectPrevious != null) {
			console.log("Perfect previous found! - " + perfectPrevious[0].name);
			return;
		}
		
		// Is there a combination of previous amounts that add up to amount?
		perfectPreviousCombination = this.perfectPreviousCombination(amount);
		if (perfectPreviousCombination != null) {
			console.log("Perfect previous combination found! - " + perfectPreviousCombination.toString());
			return;
		}
		
		// Are all of the previous amounts greater than amount?
		allPreviousAmountsGreater = this.allPreviousAmountsGreater(amount);
		if (allPreviousAmountsGreater && (this.previouses.length != 0)) {
			console.log("All previous amounts are greater than amount!");
			return;
		}
				
		person.previouses.push([this, amount]);
		this.nexts.push([person, amount]);
	};
	
	this.perfectPrevious = function(amount) {
		for (var i = 0; i < this.previouses.length; i++) {
			previousAmount = this.previouses[i][1];
			if (previousAmount == amount) {
				return this.previouses[i];
			}
		}
		return null;
	};
	
	this.perfectPreviousCombination = function(amount) {
		var s1 = [];
		for (var i = 0; i < this.previouses.length; i++) {
			var s2 = []
			s2.push(this.previouses[i]);
			s1.push(s2);
			if (i == 0) {
				continue;
			}
			s1Length = s1.length - 1;
			for (var j = 0; j < s1Length; j++) {
				s2 = [];
				for (var k = 0; k < s1[j].length; k++) {
					s2.push(s1[j][k]);
				}
				s2.push(this.previouses[i])
				if (this.perfectPreviousCombinationSum(s2) == amount) {
					return s2;
				}
				s1.push(s2);
			}
		}
		return null;
	};
	
	this.perfectPreviousCombinationSum = function(previouses) {
		var sum = 0;
		for (var i = 0; i < previouses.length; i++) {
			sum = sum + previouses[i][1];
		}
		return sum;
	};
	
	this.allPreviousAmountsGreater = function(amount) {
		for (var i = 0; i < this.previouses.length; i++) {
			if (this.previouses[i][1] < amount) {
				return false;
			}
		}
		return true;
	};
	
	this.printNexts = function() {
		for (var i = 0; i < this.nexts.length; i++) {
			nextName = this.nexts[i][0].name;
			nextAmount = this.nexts[i][1];
			console.log(this.name + " owes $" + nextAmount + " to " + nextName);
		}
	};
	
	this.printPreviouses = function() {
		for (var i = 0; i < this.previouses.length; i++) {
			previousName = this.previouses[i][0].name;
			previousAmount = this.previouses[i][1];
			console.log(this.name + " is owed $" + previousAmount + " from " + previousName);
		}
	};
	
}

function printPeople(people) {
	for (var i = 0; i < people.length; i++) {
		people[i].printNexts();
		people[i].printPreviouses();
	}
}

var bob = new Person("Bob");
var jennifer = new Person("Jennifer");
var tom = new Person("Tom");
var diane = new Person("Diane");
var jordan = new Person("Jordan");
var people = [bob, jennifer, tom, diane, jordan];

jennifer.addNext(bob, 1);
tom.addNext(bob, 1);
diane.addNext(bob, 3);

//printPeople(people);

bob.addNext(jordan, 5);

printPeople(people);


