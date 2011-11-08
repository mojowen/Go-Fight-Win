describe("filter model", function() {
  it("creates a new filter from an array and assigns variables", function() {
    var filter = new filterModel({field: 'a', operator: '=', filter: 'b'});
	expect(filter.field()).toEqual('a');
	expect(filter.operator()).toEqual('=');
	expect(filter.filter()).toEqual('b');
  });
  it("creates a new filter from a string and assigns appropriate variables", function() {
    var filter = new filterModel('a = b');
	expect(filter.field()).toEqual('a');
	expect(filter.operator()).toEqual('=');
	expect(filter.filter()).toEqual('b');
  });
});