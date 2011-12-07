function other_bindings (argument) {
	// Bindings that don't deploy with the knockout app
	$('input.url_select').live('click',function(e) {
		var $this = $(this);
		$this.select();
	});
}