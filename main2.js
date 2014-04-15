console.log("ASdasd");

function Person(name) {
	this.name = name;
	this.nexts = [];
	this.previouses = [];
	
	this.addNext = function(person, amount) {
		// Is there already a next between this and person?
		if (this.alreadyANext(person) && (this.previouses.length == 0)) {
			console.log("There are no previouses and there is a next to this person that already exists!");
			this.addToExistingAmount(person, amount);
			return;
		}
		
		// Are there any previouses?
		if (this.previouses.length == 0) {
			console.log("No previouses are there!");
			person.previouses.push([this, amount]);
			this.nexts.push([person, amount]);
			return;
		}
	
		// Is there a perfect previous?
		perfectPrevious = this.perfectPrevious(amount);
		if (perfectPrevious != null) {
			console.log("Perfect previous found! - " + perfectPrevious[0].name);
			perfectPrevious[0].removeNext(this);
			this.removePrevious(perfectPrevious[0]);
			
			perfectPrevious[0].nexts.push([person, amount]);
			person.previouses.push([perfectPrevious[0], amount]);
			return;
		}
		
		// Are all of the previous amounts greater than amount? If they are, pick any one of them and split.
		allPreviousAmountsGreater = this.allPreviousAmountsGreater(amount);
		if (allPreviousAmountsGreater != false) {
			console.log("All previous amounts are greater than amount, so pick any one of the previouses and split it - " + allPreviousAmountsGreater[0].name);
			
			return;
		}
		
		// Is there a combination of previous amounts that add up to less than or equal to the amount? If it is less than, it should be the greatest less than combination.
		perfectPreviousCombination = this.perfectPreviousCombination(amount);
		console.log("previouses that don't need to be split: " + perfectPreviousCombination[0].toString());
		if (perfectPreviousCombination[1].length == 0) {
			console.log("previouses that do need to be split: none!");
		} else if (perfectPreviousCombination[1] == false) {
			console.log("previouses that do need to be split: the person requesting the next will need to be split");
		} else {
			console.log("previouses that do need to be split: " + perfectPreviousCombination[1].toString());
		}
	};
	
	this.removePrevious = function(person) {
		for (var i = 0; i < this.previouses.length; i++) {
			if (this.previouses[i][0].name == person.name) {
				this.previouses.splice(i, 1);
				return;
			}
		}
	};
	
	this.removeNext = function(person) {
		for (var i = 0; i < this.nexts.length; i++) {
			if (this.nexts[i][0].name == person.name) {
				this.nexts.splice(i, 1);
				return;
			}
		}
	};
	
	this.equals = function(person) {
		return (this.name == person.name);
	};
	
	this.alreadyANext = function(person) {
		for (var i = 0; i < this.nexts.length; i++) {
			if (this.nexts[i][0].name == person.name) {
				return true;
			}
		}
		return false;
	};
	
	this.addToExistingAmount = function(person, amount) {
		for (var i = 0; i < this.nexts.length; i++) {
			if (this.nexts[i][0].name == person.name) {
				this.nexts[i][1] += amount;
				break;
			}
		}
		for (var i = 0; i < person.previouses.length; i++) {
			if (person.previouses[i][0].name == this.name) {
				person.previouses[i][1] += amount;
				break;
			}
		}
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
	
	this.allPreviousAmountsGreater = function(amount) {
		var i;
		for (i = 0; i < this.previouses.length; i++) {
			if (this.previouses[i][1] < amount) {
				break;
			}
		}
		if (i == this.previouses.length) {
			return this.previouses[0];
		}
		return false;
	};
	
	//  Assumes there is at least one previous and that none of them are exactly equal to amount
	this.perfectPreviousCombination = function(amount) {
		var s1 = [];
		var currentBestMaxSubset = null;
		var currentBestMaxSubsetSum = 0;
		for (var i = 0; i < this.previouses.length; i++) {
			var s2 = []
			s2.push(this.previouses[i]);
			var s2Sum = this.perfectPreviousCombinationSum(s2);
			if ((s2Sum > currentBestMaxSubsetSum) && (s2Sum < amount)) {
				currentBestMaxSubset = s2;
				currentBestMaxSubsetSum = s2Sum;
			}
			s1.push(s2);
			s1Length = s1.length - 1;
			for (var j = 0; j < s1Length; j++) {
				s2 = [];
				for (var k = 0; k < s1[j].length; k++) {
					s2.push(s1[j][k]);
				}
				s2.push(this.previouses[i])
				var s2Sum = this.perfectPreviousCombinationSum(s2);
				if (s2Sum == amount) {
					// Perfect, no split necessary
					return [s2,[]];
				} else if ((s2Sum > currentBestMaxSubsetSum) && (s2Sum < amount)) {
					currentBestMaxSubset = s2;
					currentBestMaxSubsetSum = s2Sum;
				}
				s1.push(s2);
			}
		}
		// At this point, we will need to split some previouses. I believe we only need the first previous not in currentBestMaxSubset to split.
		previousToSplit = [];
		for (var i = 0; i < this.previouses.length; i++) {
			var j;
			for (j = 0; j < currentBestMaxSubset.length; j++) {
				if (this.previouses[i][0].name == currentBestMaxSubset[j][0].name) {
					break;
				}
			}
			if (j == currentBestMaxSubset.length) {
				previousToSplit.push(this.previouses[i]);
				return [currentBestMaxSubset, previousToSplit];
			}
		}
		return [currentBestMaxSubset, false];
	};
	
	this.perfectPreviousCombinationSum = function(previouses) {
		var sum = 0;
		for (var i = 0; i < previouses.length; i++) {
			sum = sum + previouses[i][1];
		}
		return sum;
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
var kevin = new Person("Kevin");
var people = [bob, jennifer, tom, diane, jordan, kevin];

/*
jennifer.addNext(bob, 1);
tom.addNext(bob, 2);
diane.addNext(bob, 3);

printPeople(people);

bob.addNext(jordan, 5);
*/

jennifer.addNext(bob, 6);
tom.addNext(bob, 8);
diane.addNext(bob, 7);

bob.addNext(jordan, 5);
printPeople(people);

//printPeople(people);


