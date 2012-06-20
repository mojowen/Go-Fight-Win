ko.bindingHandlers.addClass = {
    init: function(element,valueAccessor) {
        element.className += ' '+valueAccessor()
    }
};
