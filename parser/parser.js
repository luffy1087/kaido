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
			scenarios : {}
		};

		var scenarios = feature.scenarios;
		
		//cycled vars
		var featureNameInfo, featureName, scenario;
		var camelizedScenarioName, scenarioName, stepInfo, step, stepKeyWord;

		for (var index = 0, line; index < contentLines.length; index++) {
			line = contentLines[index];			

			//detects feature
			featureNameInfo = line.match(R_FEATURE);
			if (!!featureNameInfo) { //is the line is a feature
				featureName = featureNameInfo[1].trim();
				feature.name = featureName;
				continue;
			}
						
			//detects scenario			
			scenario = line.match(R_SCENARIOS);
			if (!!scenario) { // is the line is a scenario
				scenarioName = scenario[1].trim();
				camelizedScenarioName = camelize(scenarioName);
				scenarios[camelizedScenarioName] = {
					name : scenarioName,
					steps : []
				};
				continue;
			}
		
			//detects every steps if scenario was detected
			if (typeof(scenarioName) === 'string') { // consider next lines as steps
				stepInfo = line.match(R_STEPS);
				if (!!stepInfo) {
					stepKeyWord = stepInfo[1].trim();
					step = stepInfo[2].trim();
					scenarios[camelizedScenarioName].steps.push({
						keyWord : stepKeyWord,
						step : step				
					});
				}
			}
		}

		return feature;
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