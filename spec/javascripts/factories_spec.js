describe("field factory", function() {
	it("field factory produces correct id when named", function() {
		var field = factoryField( { id: 1 } );
		expect(field.id).toEqual(1);
  	});
	it("feld factory produce correct name when named", function() {
		var field = factoryField({name: 'aaa' });
		expect(field.to_param ).toEqual('aaa');
	});
	it("produces random name when not named", function() {
		var field = factoryField();
		expect( field.to_param ).toEqual('name_01');
	});
});