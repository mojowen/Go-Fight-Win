describe("groupModel", function() {
	var field
  beforeEach(function() {
	field = factoryField();
	fields.push(field);
  });
  it("can create a group model using an existing field", function() {
	var group = new groupModel( field.name );
    expect(group.field()).toEqual(field.name);
  });
});