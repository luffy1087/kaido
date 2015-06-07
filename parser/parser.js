(function(){
	
	//dependencies
	var glob = require('glob');
	var fs = require('fs');
	var detectCommands = require('./detectCommands');

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
		
		var detectCommand = new detectCommands();
	
		contentLines.forEach(function(line, index) {
			detectCommand.execute(line, feature);
		});

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
