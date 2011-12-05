function graph_template (argument) {
	$('#canvas, .save_graph').live('click', function(event) {
		window.open( document.getElementById("canvas").toDataURL() ,'graph','width=400,height=200,toolbar=yes, location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes, resizable=yes');
	});
	viewModel.graph.subscribe( function() { if(  viewModel.graph() ) { draw(); } })
}