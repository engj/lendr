var tom = new Person("Tom");
var diane = new Person("Diane");
var bob = new Person("Bob");
var jordan = new Person("Jordan");

var tree = new Tree();

tree.addPerson(tom);
tree.addPerson(bob);
tree.addPerson(diane);

tree.addConnection(bob, jordan, 2);
tree.addConnection(diane, bob, 1);
tree.addConnection(tom, bob, 1);

tree.listConnections();

tree.simplifyPerson(bob);

tree.listConnections();


