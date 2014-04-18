function Person(name) {
	this.name = name;
	this.nexts = {};
	this.prevs = {};
}

Person.prototype.addNext = function(next, amount) {
	if (_.has(this.nexts, next.name)) {
		this.nexts[next.name] += amount;
	} else {
		this.nexts[next.name] = amount;
	}
};

Person.prototype.addPrev = function(prev, amount) {
	if (_.has(this.prevs, prev.name)) {
		this.prevs[prev.name] += amount;
	} else {
		this.prevs[prev.name] = amount;
	}
};

Person.prototype.removeNext = function(next) {
	delete this.nexts[next.name];
};

Person.prototype.removePrev = function(prev) {
	delete this.prevs[prev.name];
};