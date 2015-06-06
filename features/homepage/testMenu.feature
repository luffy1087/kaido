SetUp:
	Log setUp string

TearDown:
	Log tearDown string

Feature:	my feature name
	Scenario: my test Menu
		Given I visit the homepage
		When I mouveover on category menu
		Then I can see all of the categories
	
