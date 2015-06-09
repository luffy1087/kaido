(function() {
	//dependencies
	var parser = require('./parser/parser');

	function onParsedFeature(features) {
		/*
			TODO:
				1) prepare scenarios based on table property, if any.
				2) thinking of the logic to match steps to code and regexp dictionary
				3) installing selenium webdriver and SeleniumWebDriverJs
		*/
		console.log(JSON.stringify(features));
	}
	
	parser.parse().then(onParsedFeature);

})();
