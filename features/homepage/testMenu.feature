SetUp:
	Log setUp string

TearDown:
	Log tearDown string

Feature:	my feature name 1
	Scenario: my first test Menu
		Given I visit the homepage in it
		When I mouveover on category menu
		Then I can see all of the categories
	
	Scenario: my second test Menu
		Given I visit the homepage in us
		When I click on register
		Then Register popup appears
