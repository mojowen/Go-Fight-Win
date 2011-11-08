describe("Dirty flag as used with a rowModel object", function() {
	var row;
	beforeEach(function() {
		fields.removeAll();
	  	fields.push( factoryField() );
	    row = factoryRow();
	});
  it("Is not flagged when key updates", function() {
	row.key(6969)
	expect(row.dirtyFlag.isDirty()).toBeFalsy();
  });
  it("Is not flagged when list updates", function() {
	row.list = 'diff'
	expect(row.dirtyFlag.isDirty()).toBeFalsy();
  });

  it("Is flagged when a field updates", function() {
	row[ fields()[0].name ]('different thing');
	expect(row.dirtyFlag.isDirty()).toBeTruthy();
  });
  it("Can reset when passed a version of the inital state", function() {
	row[ fields()[0].name ]('different thing');
	row.dirtyFlag.reset( row )
	expect( row.dirtyFlag.isDirty() ).toBeFalsy();
  });
  it("doesn't update if passed a different value then the inital state", function() {
	row[ fields()[0].name ]('different thing');
	var saving_me_now = ko.toJS(row);
	row[ fields()[0].name ]('different thing entirely!');
	row.dirtyFlag.reset( saving_me_now )
	expect(row.dirtyFlag.isDirty()).toBeTruthy();
  });
  it("Can initialize a row dirty", function() {
    var dirty_row = factoryRow({key: 'new'});
    expect(dirty_row.dirtyFlag.isDirty()).toBeTruthy();
  });
});