ko.dirtyFlag = function(root, isInitiallyDirty) {
    var result = function() {}

    var _initialState = ko.observable( root._flatten('json') );
    var _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.dependentObservable(function() {
		// would add to the undo list
        return _isInitiallyDirty() || _initialState() !== root._flatten('json');
    });

    result.reset = function(now) {
		if ( now._flatten('json') === root._flatten('json') ) {
			_initialState( root._flatten('json') );
			_isInitiallyDirty(false);
			return true;
		} else {
			return false;
		}
    };
	result.__initial = function() {
		return _initialState();
	}
	result.setDirty = function() {
		_isInitiallyDirty(true);
	}
	result.__compare = function() {
		var initial = JSON.parse( _initialState() ),
			current = JSON.parse( root._flatten('json') ),
			problem = {};
		for( var i in initial ) {
			if( ko.toJSON(initial[i]) != ko.toJSON(current[i]) ) {
				problem[i] = {initial: initial[i], current: current[i] };
			}
		}
		return problem;
	}

    return result;
};