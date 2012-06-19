// Block
$(document).on({
	focusin: function(e) { $(this).elastic().parent().addClass('open') },
	focusout:function(e) { $(this).parent().removeClass('open') } 
},'.block textarea')
tableModel.__addTemplate('block','<textarea data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\', elastic: true" class="block"></textarea>',200)
