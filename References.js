var References = {
	constructor: function(){
		this.objects = [];
		this.values = [];
		this.index = 0;
	},

	has: function(object){
		this.index = this.objects.indexOf(object);
		return this.index != -1;
	},

	add: function(object, value){
		this.objects.push(object);
		this.values.push(value);
	}
};

References.constructor.prototype = References;
References = References.constructor;

return References;