ko.dirtyFlag = function(root, isInitiallyDirty) {
    var result = function() {}

    var _initialState = ko.observable( flattenRow(root,'json') );
    var _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.dependentObservable(function() {
        return _isInitiallyDirty() || _initialState() !== flattenRow(root,'json');
    });

    result.reset = function(now) {
		if ( flattenRow(now,'json') === flattenRow(root,'json') ) {
			_initialState( flattenRow(root,'json') );
			_isInitiallyDirty(false);
		}
    };

    return result;
};