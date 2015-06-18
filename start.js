(function() {

	var kaidoParserClass = require('kaidoparser')
	  , kaidoMatcherClass = require('kaidomatcher')
	  , kaidoParser = new kaidoParserClass()
	  , kaidoMatcher;

	
	kaidoParser.start()

	.then(function(parsedFeature) {
		kaidoMatcher = new kaidoMatcherClass(parsedFeature);
	})

	.then(function() {
		kaidoMatcher.start().then(function() {
			console.log('THAT DID IT WELL');
		}) // it raises an error because features do not match the code. diffents names.
	});

})();
