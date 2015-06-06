(function(){
	
	//dependencies
	var glob = require('glob');
	var fs = require('fs');

	//regurar expressions
	var R_FEATURE = /^Feature:(.+)/m;
	var R_SCENARIOS = /^\tScenario:(.+)/m;
	var R_STEPS = /^\t\t([^\s]+)(.+)/m;


	function camelize(s) {
		return s.replace(/\s(.)/g, function(whatFound) {
			return whatFound[1].toUpperCase();
		}).replace(/\s/g, '');
	}

	function getFeatureFiles(resolve, reject) {
		glob('**/**/*.feature', null, function(err, files) {
			if (err) {
				reject(err);
			} else if (files && files.length > 0) {
				resolve(files);
			}
		});
	}


	function readFatureFiles(files) {
		var featuresContents = [], content;
		for (var index = 0, file; file = files[index]; index++) {
			console.log('read file : ' + file);
			content = fs.readFileSync(file);
			featuresContents.push({
				content : content,
				fileName : file
			});
		}
		return featuresContents;
	}

	function parseFeatures(contents) {
		var features = [];
		var feature;
		for (var index = 0, content; content = contents[index]; index++) {
			feature = parseFeature(content);
			features.push(feature);
		}
		return features;
	}

	function parseFeature(content) {

		var fileName = content.fileName;
		var contentLines = content.content.toString().split('\n');

		//feature object to return
		var feature = {
			fileName : fileName,
			scenarios : []
		};

		var commands = [
			detectFeature,
			detectScenario,
			detectStep
		]

		for (var index = 0, line; index < contentLines.length; index++) {
			
			line = contentLines[index];
			
			for (var i = 0, command, isCommandExecuted; command = commands[i]; i++) {
				isCommandExecuted = command(line, feature);
				
				if (isCommandExecuted) {
					continue;
				}
				
				if (isCommandExecuted && commands[0].contructor === detectFeature) { // alloewed one Feature keyword per .feature files.
					commands.slice(0, 1);
				}
			}

		}

		return feature;
	}

	function detectFeature(line, feature) {
			//detects feature
			var featureNameInfo = line.match(R_FEATURE);
			var featureName; 
			if (!!featureNameInfo) { //if the line is a feature
				featureName = featureNameInfo[1].trim();
				feature.name = featureName;
			}

			return !!featureName || false;
	}

	function detectScenario(line, feature) {
		var scenarios = feature.scenarios;
		var scenarioInfo = line.match(R_SCENARIOS), scenarioName, camelScenarioName; 
		if (!!scenarioInfo) { // if the line is a scenario
			scenarioName = scenarioInfo[1].trim();
			camelScenarioName = camelize(scenarioName);
			scenarios.push({
				name : scenarioName,
				camelName : camelScenarioName,
				steps : []
			});
		}
		return !!scenarioName || false;
	}

	function detectStep(line, feature) {
		//detects every steps if scenario was detected
		var lastScenario = feature.scenarios[feature.scenarios.length-1];
		if (lastScenario) { // consider next lines as steps
			stepInfo = line.match(R_STEPS);
			if (!!stepInfo) {
				stepKeyWord = stepInfo[1].trim();
				step = stepInfo[2].trim();
				lastScenario.steps.push({
					keyWord : stepKeyWord,
					step : step				
				});
			}
		}
	}

	function onParsedFeatures(features) {
		console.log(JSON.stringify(features));
	}

	function getFeatureFilesError(err) {
		console.log('an error occurred');
		console.log(err);
	}

	function parse() {
		new Promise(getFeatureFiles)
			.then(readFatureFiles, getFeatureFilesError)
			.then(parseFeatures)
			.then(onParsedFeatures);
	}
	
	module.exports = {
		parse : parse
	};

})();
