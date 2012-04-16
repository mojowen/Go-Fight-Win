/*
things each field needs to be tested for
 - mousedown doesnt 
 - dblclick does
 - can update a value
 - updates value when value updated on back end

 - copies the correct value
 - anything special
*/
describe("the bindings on fields", function() {
  var select,multiselect,number,block,suggest
  beforeEach(function() {
    factoryList({
		fields:[
			{field_type:'select',field_options:['First','Second','Third','Fourth']},
			{field_type:'multiselect',field_options:['Start','Stop','Left','Right']},
			{field_type:'number'},
			{field_type:'block'},
			{field_type:'suggest'},
			{field_type:'date'}
		]
	});
	select = fields()[0].to_param,
	multiselect = fields()[1].to_param,
	number = fields()[2].to_param,
	block = fields()[3].to_param,
	suggest = fields()[4].to_param
	date = fields()[5].to_param

	newRows.push( new rowModel({key: 'new', list: _list })  );

	loadFixtures("views/lists/_row.html","views/lists/_newRow.html");
	ko.applyBindings(dataModel);
  });
  describe("the select bindings", function() {
     it("opens and is changed", function() {
		spyOnEvent($('.select button:visible'), 'open');
 		$('.select button:visible').click()
		expect('open').toHaveBeenTriggeredOn($('.select button:visible'));
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click();
 		expect(newRows()[0][select]()).toEqual('Fourth');
     });
     it("updates when changed above", function() {
 		expect( $('.select button:visible span') ).toHaveText('Select')
 		newRows()[0][select]('Third');
 		expect( $('.select button:visible span') ).toHaveText('Third')
 		$('.select button:visible').click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Third');
     });
   });
   describe("the multiselect bindings", function() {
     it("opens and is changed - more than one", function() {
 		expect(newRows()[0][multiselect]()).not.toEqual(['Start', 'Stop', 'Right']);
 		$('.multiselect button:visible').click();
 		$('.ui-multiselect-checkboxes li:first input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:eq(1) input').attr('checked','checked').click()
 		expect(newRows()[0][multiselect]()).toEqual(['Start', 'Stop', 'Right']);
     });
     it("updates when changed above - only one", function() {
 		expect( $('.multiselect button:visible span') ).toHaveText('Select options')
 		newRows()[0][multiselect](['Stop']);
 		expect( $('.multiselect button:visible span') ).toHaveText('Stop')
 		$('.multiselect button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Stop');
     });
     it("updates when changed above - more than one", function() {
 		expect( $('.multiselect button:visible span') ).toHaveText('Select options')
 		newRows()[0][multiselect](['Stop', 'Left']);
 		expect( $('.multiselect button:visible span') ).toHaveText('2 selected')
 		$('.multiselect button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked:first').parent() ).toHaveText('Stop');
 		expect( $('.ui-multiselect-checkboxes input:checked:last').parent() ).toHaveText('Left');
     });
   });   
   describe("the number bindings", function() {
     it("opens and is changed", function() {
 		expect(newRows()[0][number]()).not.toEqual(69);
 		$('.number textarea').val(69).change();
 		expect(newRows()[0][number]()).toEqual('69');
     });
     it("updates when changed above", function() {
 		newRows()[0][number](420);
 		expect( $('.number textarea') ).toHaveValue(420);
     });
     it("updates when up is clicked", function() {
 		newRows()[0][number](2);
		$('.form .number_up').click();
 		expect( $('.number textarea') ).toHaveValue(3);
     });
     it("updates when changed above", function() {
 		newRows()[0][number](2);
		$('.form .number_down').click();
 		expect( $('.number textarea') ).toHaveValue(1);
     });
   });
   describe("the block bindings", function() {
     it("opens and is changed", function() {
 		expect(newRows()[0][block]()).not.toEqual("Long long long\nlong long\nlong long\nsection");
 		$('.block textarea').val("Long long long\nlong long\nlong long\nsection").change();
 		expect(newRows()[0][block]()).toEqual("Long long long\nlong long\nlong long\nsection");
     });
     it("updates when changed above", function() {
 		newRows()[0][block]("Long long long\nlong long\nlong long\nsection");
 		expect( $('.block textarea') ).toHaveValue("Long long long\nlong long\nlong long\nsection");
     });
   });
   describe("the suggest bindings", function() {
     it("opens and is changed", function() {
 		expect(newRows()[0][suggest]()).not.toEqual("SuggestMe");
 		$('.form textarea.suggest').val("SuggestMe").change().focus();
 		expect( $('.form textarea.suggest').attr('aria-haspopup') ).toEqual('true');
 		expect(newRows()[0][suggest]()).toEqual("SuggestMe");
     });
   });
  describe("the date bindings", function() {
    it("renders a blank row as -- not a date", function() {
		expect( $('.form textarea.date').click().val() ).toEqual('--')
    });
    it("opens the calendar when date textarea", function() {
		$('.form textarea.date').click();
		expect( $('.form textarea.date:first').next('div') ).toContain('div.ui-datepicker-inline');
    });
    it("opens the calendar when clicking on the calendar icon", function() {
		$('.form .cal').click();
		expect( $('.form textarea.date:first').next('div') ).toContain('div.ui-datepicker-inline');
    });
    it("presses down button date back", function() {
		var press = $.Event("keydown"),
			t = new Date();
		newRows()[0][date](t.toDateString());
		press.ctrlKey = false, 
			press.keyCode = 40;
		$('.form textarea.date:first').trigger(press);
	  expect( new Date( newRows()[0][date]()).getDate() ).toEqual( t.getDate() - 1 );
    });
    it("presses down button date forward", function() {
		var press = $.Event("keydown"),
			t = new Date();
		newRows()[0][date](t.toDateString());
		press.ctrlKey = false, 
			press.keyCode = 38;
		$('.form textarea.date:first').trigger(press);
	  expect( new Date( newRows()[0][date]()).getDate() ).toEqual( t.getDate() + 1 );
    });
   });



});