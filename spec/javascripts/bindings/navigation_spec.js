describe("the bindings on fields", function() {
	var press
	beforeEach(function() {
		factoryList();
		loadFixtures("views/lists/_row.html","views/lists/_table.html");
		ko.applyBindings(dataModel);
		press  = $.Event("keydown");
		press.ctrlKey = false;
	});

  describe("basic click functionality and navigation", function() {

	    it("clicking a textarea adds select class but does not focus", function() {

			$('.data:first').mousedown();
			// Add select
			expect( $('textarea:first').parent('td').hasClass('selected') ).toBeTruthy();
			expect( $('tbody tr:eq(0) td.cell:eq(0)')).toHaveClass('selected');
			//  Doesn't open anything else
			expect( $('textarea:first').hasClass('open') ).not.toBeTruthy();

			// Down
			press.keyCode = 40;
			$(document).trigger(press);
			expect( $('tbody tr:eq(1) td.cell:first') ).toHaveClass('selected');

			// Right
			press.keyCode = 39;
			$(document).trigger(press);
			expect( $('tbody tr:eq(1) td.cell:eq(1)')).toHaveClass('selected');
			
			// Up
			press.keyCode = 38;
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(1)')).toHaveClass('selected');
			
			// Left
			press.keyCode = 37;
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(0)')).toHaveClass('selected');
			
			// Ctrl Down
			press.ctrlKey = true, 
				press.keyCode = 40;
			$(document).trigger(press);
			expect( $('tbody tr:last td.cell:first') ).toHaveClass('selected');
			
			// Ctrl Right
			press.keyCode = 39;
			$(document).trigger(press);
			expect( $('tbody tr:last td.cell:last')).toHaveClass('selected');
			
			// Ctrl Up
			press.keyCode = 38;
			$(document).trigger(press);
			expect( $('tbody tr:first td.cell:last')).toHaveClass('selected');
			
			// Ctrl Left
			press.keyCode = 37;
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(0)')).toHaveClass('selected');
		
			// Tab
			press.ctrlKey = false,
				press.keyCode = 9;
			$(document).trigger(press);
			expect( $('tbody tr:first td.cell:eq(1)')).toHaveClass('selected');
			
			// Shift + Tab
			press.shiftKey = true, 
				press.keyCode = 9;
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(0)')).toHaveClass('selected');
			
			// Pressing Enter opens the selected filed box
			press.shiftKey = false, 
				press.keyCode = 13;
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(0) .data')).toHaveClass('open');
		
			// Pressing Enter closes the box if open
			press.keyCode = 13;
			$('tbody tr:eq(0) td.cell:eq(0) .data').dblclick().focus();
			$(document).trigger(press);
			expect( $('tbody tr:eq(0) td.cell:eq(0) .data')).not.toHaveClass('open');
		
		    });
	it("double clicking adds select and open's on the textarea", function() {
		$('.data:first').dblclick().focus();
		expect( $('.data:first').hasClass('open') ).toBeTruthy();
		expect( $('tbody tr:eq(0) td.cell:eq(0)') ).toHaveClass('selected');
	
		//  No nav keyboard shortcuts work when open
	
		// Down
		var press = $.Event("keydown");
		press.ctrlKey = false,
			press.shiftKey = false,
			press.keyCode = 40;
		$(document).trigger(press);
		expect( $('tbody tr:eq(1) td.cell:first') ).not.toHaveClass('selected');
	
		// Right
		press.keyCode = 39;
		$(document).trigger(press);
		expect( $('tbody tr:eq(1) td.cell:eq(1)')).not.toHaveClass('selected');
		
		//  Need to move cursor so can test left and right
		$('tbody tr:eq(1) td.cell:eq(1) .data').dblclick().focus();
		expect( $('tbody tr:eq(1) td.cell:eq(1) .data').hasClass('open') ).toBeTruthy();
		expect( $('tbody tr:eq(1) td.cell:eq(1)') ).toHaveClass('selected');
	
		// Up
		press.keyCode = 38;
		$(document).trigger(press);
		expect( $('tbody tr:eq(0) td.cell:eq(1)')).not.toHaveClass('selected');
		
		// Left
		press.keyCode = 37;
		$(document).trigger(press);
		expect( $('tbody tr:eq(1) td.cell:eq(0)')).not.toHaveClass('selected');
		
		//  Tab still works though
		$('tbody tr:eq(1) td.cell:eq(1) .data').dblclick().focus();
		expect( $('tbody tr:eq(1) td.cell:eq(1) .data').hasClass('open') ).toBeTruthy();
		expect( $('tbody tr:eq(1) td.cell:eq(1)') ).toHaveClass('selected');
	
		// Tab
		press.ctrlKey = false,
			press.keyCode = 9;
		$(document).trigger(press);
		expect( $('tbody tr:eq(1) td.cell:eq(2)')).toHaveClass('selected');
		
		// Shift + Tab
		press.shiftKey = true, 
			press.keyCode = 9;
		$(document).trigger(press);
		expect( $('tbody tr:eq(1) td.cell:eq(1)')).toHaveClass('selected');
	});
	// - enter to open
	// - exit to close
  });

});
describe("scrolling", function() {
  beforeEach(function() {
    factoryList({rows: 300});
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
	setBindings();
  });
  it("only loads 30 rows to begin with, then loads more as scrolls down", function() {
    expect($('.editor tbody tr').length).toEqual(90);
	//expect( $('#viewport').height() ).toEqual( rows().length * 26 );
  });

// other things to test:
// - can 'jump' to a line and loads area
// - rebuilding scroll after a sort or a filter (later prob)

});