describe("savingViews dependent variable", function() {
  it("returns unsaved views", function() {
	var view = new viewModel();
    views.push( view );
	expect(dataModel.savingViews()[0] ).toEqual( view._flatten );
  });
  it("doesn't return non-dirty views", function() {
	var view = new viewModel({name: 'thing', id: 1});
    views.push( view );
	expect(dataModel.savingViews().length).not.toEqual(1);
  });
  it("does return deleted views", function() {
	var view = new viewModel({name: 'thing', id: 1});
    views.push( view );
    views.destroy(view)
	expect( dataModel.savingViews()[0] ).toEqual( view._flatten );
  });
});