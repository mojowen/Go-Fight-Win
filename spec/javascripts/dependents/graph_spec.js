describe("dependent variable graph", function() {
	var field_1;
  beforeEach(function() {
    	factoryList();

		field_1 = fields()[0].to_param;

  });
  it("is false if there's nothing to graph", function() {
    expect(viewModel.graph()).toBeFalsy();
  });
  it("is true if there's a goal for it to graph", function() {
	dataModel.current.view().goal( { field: ko.observable({name: field_1, label: 'hey'}), value: ko.observable(69) } );
    expect(viewModel.graph()).toBeTruthy();
  });
 // it("produces the correct bars when there's just a goal", function() {
 //    expect(true).toBeFalsy();
 //  });
 // it("produces the correct bars when there's one group", function() {
 //   expect(true).toBeTruthy();
 // });
 // it("produces correct bars when there's two groups", function() {
 //   expect(true).toBeFalsy();
 // });
 //   
});