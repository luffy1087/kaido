(function() {

	//regurar expressions
	var R_SETUP = /^SetUp:$/m
	var R_TEARDOWN = /^TearDown:$/m;
	var R_FEATURE = /^Feature:(.+)/m;
	var R_SCENARIOS = /^\tScenario:(.+)/m;
	var R_STEPS = /^\t\t?([^\s]+)(.+)/m;

	function camelize(s) {
		return s.replace(/\s(.)/g, function(whatFound) {
			return whatFound[1].toUpperCase();
		}).replace(/\s/g, '');
	}
	
	function detectFeature(line, feature) {
		//detects feature
		var featureNameInfo = line.match(R_FEATURE);
		var featureName;
		if (!!featureNameInfo) { //if the line is a feature
			featureName = featureNameInfo[1].trim();
			feature.name = featureName;
		}
		return {
			isExecuted : !!featureNameInfo,
			commandName : 'detectFeature'
		};
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
		return {
			isExecuted : !!scenarioName,
			commandName : 'detectScenario'
		};
	}

	function detectStep(line, feature) {
		//detects every steps if scenario was detected, else check setUp and tearDown
		var command = 'detectStep';
		var executed = false;
		var stepInfo = line.match(R_STEPS);
		if (!!stepInfo) {
			//step vars
			var stepKeyWord = stepInfo[1].trim();
			var step = stepInfo[2].trim();
			var stepJson = {
				keyWord : stepKeyWord,
				step : step	
			};
			//end step vars
			var lastScenario = feature.scenarios.length > 0 ? feature.scenarios[feature.scenarios.length-1] : false;
		
			if (lastScenario) { // if scenario is present, then add step to the scenario
				lastScenario.steps.push(stepJson);
				executed = true;
			} else if (feature.setUp && !feature.setUp.step) {
				feature.setUp = stepJson; //executed before every steps
				command = 'detectSetUp';
				executed = true;
			} else if (feature.tearDown && !feature.tearDown.step) {
				feature.tearDown = stepJson; ////executed after every steps
				command = 'detectTearDown';
				executed = true;
			}
		}
		return {
			isExecuted : executed,
			commandName : command
		};
	}

	function detectSetUp(line, feature) {
		var setUpInfo = line.match(R_SETUP);
		if (!!setUpInfo) {
			feature.setUp = {};
		}
		return {
			isExecuted : !!setUpInfo,
			commandName : 'detectSetUp'
		};
	}

	function detectTearDown(line, feature) {
		var tearDownInfo = line.match(R_TEARDOWN);
		if (!!tearDownInfo) {
			feature.tearDown = {};
		}
		return {
			isExecuted : !!tearDownInfo,
			commandName : 'detectTearDown'
		};
	}

	function execute(line, feature) {
		var shouldDeleteCommand, commandsToRemove = [];
		var commands = this.commands, commandExecution;
		var isCommandExecuted, executedCommandName;
		
		for (var i = 0, command, commandExecution; command = commands[i]; i++) {
			
			commandExecution = command(line, feature);
			isCommandExecuted = commandExecution.isExecuted;
			executedCommandName = commandExecution.commandName;
			
			shouldDeleteCommand = this.shouldDeleteCommand(isCommandExecuted, executedCommandName, feature);

			if (shouldDeleteCommand) {
				commandsToRemove.push(executedCommandName);
			}

			if (isCommandExecuted) {
				break;
			}
		}
		
		this.removeCommands(commandsToRemove);
	}

	function shouldDeleteCommand(isCommandExecuted, commandName, feature) {
		
		if (!isCommandExecuted) {
			return false;
		}

		if (commandName === 'detectSetUp' && feature.setUp && feature.setUp.step) {
			return true;
		}

		if (commandName === 'detectTearDown' && feature.tearDown && feature.tearDown.step) {
			return true;
		}

		if (commandName === 'detectFeature' && feature.name) {
			return true;
		}
 		
		return false;
	}

	function removeCommands(commandsName) {
		var commands = this.commands;
		for (var i = 0; commandName = commandsName[i]; i++) {
			for (var j = 0, command; command = commands[j]; j++) {
				if (command.name === commandName) {
					commands.splice(j, 1);
					break;
				}
			}
		}
	}

	function DetectCommandClass() {
		
		this.commands = [
			detectSetUp,
			detectTearDown,
			detectFeature,
			detectScenario,
			detectStep
		];

	}

	DetectCommandClass.prototype.execute = execute;
	DetectCommandClass.prototype.detectSetUp = detectSetUp;
	DetectCommandClass.prototype.detectTearDown = detectTearDown;
	DetectCommandClass.prototype.detectFeature = detectFeature;
	DetectCommandClass.prototype.detectScenario = detectScenario;
	DetectCommandClass.prototype.detectStep = detectStep;
	DetectCommandClass.prototype.shouldDeleteCommand = shouldDeleteCommand;
	DetectCommandClass.prototype.removeCommands = removeCommands;


	module.exports = DetectCommandClass;
})();



