SetUp:
	Log setUp string

TearDown:
	Log tearDown string

Feature:	my feature name 1
	Scenario: my first test Menu
		Given I visit the homepage in [isoCode]
		When I [action] on category menu
		Then I can see all of the categories
		
	Where:
		isoCode | action
		us			|	mouseover
		it			|	click
		
	
	Scenario: my second test Menu
		Given I visit the homepage in [isoCode]
		When I [action] on register
		Then Register popup appears
	
	Where:
		isoCode	|	action
		it			|	mouseover
		us			|	doubleclick
