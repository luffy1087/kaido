(function() {

	module.exports.defineSteps = function(steps) {
		
		steps.given(/I visit the homepage in \[isoCode\]/i, function() { //none step match the feature...raise an error
			console.log('I click the category FUNZIONA');				
		});


		steps.when(/I go to the search page/, function() {
			console.log('I go to the search page FUNZIONA');				
		});
	
		steps.then(/The number of products must be greater than zero/, function() {
			console.log('The number of products must be greater than zero FUNZIONA');				
		});

	};
	
})();
