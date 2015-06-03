/*

name: Object.cloning
https://gist.github.com/NV/1396086

*/

var implementProperty = include('dmail/property').implementProperty;
var References = include('./References');

var clonePropertyOf, clonePropertiesOf;
if( 'getOwnPropertyDescriptor' in Object ){
	clonePropertyOf = function(object, name, owner, references){
		var descriptor = Object.getOwnPropertyDescriptor(owner, name);

		if( 'value' in descriptor ){
			descriptor.value = cloneValue(descriptor.value, references);
		}

		Object.defineProperty(object, name, descriptor);
	};

	clonePropertiesOf = function(object, owner, references){
		var names = Object.getOwnPropertyNames(owner), i = 0, j = names.length;
		for(;i<j;i++){
			clonePropertyOf(object, names[i], owner, references);
		}

		if( !Object.isExtensible(owner) ) Object.preventExtensions(object);
		if( Object.isSealed(owner) ) Object.seal(object);
		if( Object.isFrozen(owner) ) Object.freeze(object);

		return object;
	};
}
else{
	clonePropertyOf = function(object, name, owner, references){
		object[name] = cloneValue(owner[name], references);
	};

	clonePropertiesOf = function(object, owner, references){
		var names = Object.keys(owner), i = 0, j = names.length;
		for(;i<j;i++){
			clonePropertyOf(object, names[i], owner, references);
		}
		return object;
	};
}

// clone the value only if it's not a reference to a previously cloned object
function cloneValue(value, references){
	if( references && references.has(value) ){
		value = references.values[references.index];
	}
	else{
		value = cloneOf(value, references);
	}
	return value;
}

function createEmptyCopy(object){
	var copy;

	if( Object.prototype.toString.call(object) === '[object Array]' ){
		// new Array(object) would work too, a copied array would be returned
		// but elements inside still have to be cloned
		copy = new Array(object.length);
	}
	else{
		copy = Object.create(Object.getPrototypeOf(object));
	}

	return copy;
}

function clone(object, references){
	var copy = createEmptyCopy(object);
	references = references || new References();
	references.add(object, copy);
	return clonePropertiesOf(copy, object, references);
}

function cloneOf(object, references){
	var target;

	if( typeof object === 'object' && object !== null ){
		if( typeof object.clone === 'function' ){
			target = object.clone();
		}
		else{
			target = clone(object);
		}
	}
	else{
		target = object;
	}

	return target;
}

[String, Number, Boolean].forEach(function(constructor){
	Object.implementProperty(constructor.prototype, 'clone', function clonePrimitive(){
		return this;
	});
});

[RegExp, Date].forEach(function(constructor){
	Object.implementProperty(constructor.prototype, 'clone', function cloneNative(){
		return new this.constructor(this.valueOf());
	});
});

return {
	clonePropertyOf: clonePropertyOf,
	clonePropertiesOf: clonePropertiesOf,
	clone: clone
};