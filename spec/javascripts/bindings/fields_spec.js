describe("the bindings on fields", function() {
  beforeEach(function() {
    factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
  // describe("the select bindings", function() {
  //   it("description", function() {
  //     	expect(true).toBeFalsy();
  //   });
  // 
  // });
  // describe("the number binding", function() {
  //   it("description", function() {
  //     	expect(true).toBeFalsy();
  //   });
  // });
  // describe("date binding", function() {
  //   it("description", function() {
  //     	expect(true).toBeFalsy();
  //   });
  // });
  // describe("the autocomplete binding", function() {
  //   it("description", function() {
  //     	expect(true).toBeFalsy();
  //   });
  // });
});