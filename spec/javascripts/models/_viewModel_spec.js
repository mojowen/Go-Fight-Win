describe("vieModel can be initalized ", function() {
  it("returns a name when created", function() {
    var view = new viewModel({name: 'a name'});
	expect(view.name).toEqual('a name');
  });
  it("creates a name if one isn't passed", function() {
    var view = new viewModel();
	expect(view.name).toBeDefined();
  });
  it("passes filters if they are passed one value in an array", function() {
    var view = new viewModel({ filters: ['a is b'] });
    expect( ko.toJS(view.filters()[0]) ).toEqual( ko.toJS(new filterModel('a is b')) );
  });
  it("passes filters if they are passed one value in a string", function() {
    var view = new viewModel({ filters: 'a is b' });
    expect( ko.toJS(view.filters()[0]) ).toEqual( ko.toJS(new filterModel('a is b')) );
  });
  it("passes filters in correct order if they are passed in an array", function() {
	var filters = ['a is b','c is d','e is f'];
    var view = new viewModel({ filters: filters});
	for (var i=0; i < view.filters().length; i++) {
		expect( ko.toJS(view.filters()[i]) ).toEqual( ko.toJS( new filterModel(filters[i]) ) );
	}
  });
});