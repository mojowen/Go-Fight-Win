describe("field factory", function() {
	it("field factory produces correct id when named", function() {
		var field = factoryField( { id: 1 } );
		expect(field.id).toEqual(1);
  	});
	it("feld factory produce correct name when named", function() {
		var field = factoryField({name: 1 });
		expect(field.name).toEqual(1);
	});
	it("produces random name when not named", function() {
		var field = factoryField();
		expect( field.name ).toEqual('name_01');
	});
});