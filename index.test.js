exports['support circular references'] = function(test){
	var a = {};
	a.self = a;
	var b = Object.clone(a);

	test.equal(a.self, a);
	test.equal(b.self, b);
	test.equal(a != b, false);
};

exports['cloned object have same prototype'] = function(test){
	var a = {};
	var b = Object.create(a);
	var c = Object.clone(b);

	test.equal(Object.getPrototypeOf(c), a);
};

exports['cloned array get non index properties'] = function(test){
	var a = [0];
	a.foo = 'bar';
	var b = Object.clone(a);

	test.equal(b.foo, 'bar');
};

exports['cloned array clone their contents'] = function(test){
	var a = [{
		clone: function(){ return 'foo'; }
	}];

	test.equal(Object.clone(a)[0], 'foo');
};

exports['cloned function share reference (are not cloned)'] = function(test){
	var a = {
		foo: function(){}
	};
	var b = Object.clone(a);

	test.equal(a.foo, b.foo);
};