(function () {
	'use strict';
	var citylist = [
		'Victoria', 'Vancouver', '100 Mile House', 'Abbotsford', 'Armstrong', 'Barriere', 'Burnaby', 'Campbell River', 'Castlegar', 'Central Saanich', 'Chetwynd', 'Chilliwack', 'Clearwater', 'Coldstream', 'Colwood', 'Comox', 'Coquitlam', 'Courtenay', 'Cranbrook', 'Creston', 'Dawson Creek', 'Delta', 'Duncan', 'Elkford', 'Enderby', 'Esquimalt', 'Fernie', 'Fort St. James', 'Fort St. John', 'Grand Forks', 'Greenwood', 'Highlands', 'Hope', 'Houston', 'Hudson\'s Hope', 'Invermere', 'Kamloops', 'Kelowna', 'Kent', 'Kimberley', 'Kitimat', 'Ladysmith', 'Lake Country', 'Langford', 'Langley', 'Langley', 'Lantzville', 'Lillooet', 'Logan Lake', 'Mackenzie', 'Maple Ridge', 'Merritt', 'Metchosin', 'Mission', 'Nanaimo', 'Nelson', 'New Hazelton', 'New Westminster', 'North Cowichan', 'North Saanich', 'North Vancouver', 'North Vancouver', 'Northern Rockies', 'Oak Bay', 'Parksville', 'Peachland', 'Penticton', 'Pitt Meadows', 'Port Alberni', 'Port Coquitlam', 'Port Edward', 'Port Hardy', 'Port Moody', 'Powell River', 'Prince George', 'Prince Rupert', 'Qualicum Beach', 'Quesnel', 'Revelstoke', 'Richmond', 'Rossland', 'Saanich', 'Salmon Arm', 'Sechelt', 'Sicamous', 'Sidney', 'Smithers', 'Sooke', 'Spallumcheen', 'Sparwood', 'Squamish', 'Stewart', 'Summerland', 'Surrey', 'Taylor', 'Terrace', 'Tofino', 'Trail', 'Tumbler Ridge', 'Ucluelet', 'Vanderhoof', 'Vernon', 'View Royal', 'Wells', 'West Kelowna', 'West Vancouver', 'White Rock', 'Williams Lake'
	];
	var capabilities = [
		{key:'c01', id:'agile-coach',                                            text:'Agile Coach',                                               description:'Experience transforming initiatives to deliver lasting change within agencies that focus on delivering value for citizens.'},
		{key:'c02', id:'backend-web-developer',                                  text:'Backend Web Developer',                                     description:'Experience using modern, open source software to prototype and deploy backend web applications, including all aspects of server-side processing, data storage, and integration with frontend development.'},
		{key:'c03', id:'business-analyst',                                       text:'Business Analyst',                                          description:'Familiar with a range of digital/web services and solutions, ideally where open source and cloud technologies and agile development methodologies have been applied. An eye for detail, excellent communication skills, ability to rationalize complex information to make it understandable for others to work, and ability to interrogate reported information and challenge sources where inconsistencies are found.'},
		{key:'c04', id:'delivery-manager',                                       text:'Delivery Manager (Scrum Master)',                           description:'Experience setting up teams for successful delivery by removing obstacles (or blockers to progress), constantly helping the team to become more self-organizing, and enabling the work the team does rather than impose how it’s done.'},
		{key:'c05', id:'devops-engineer',                                        text:'DevOps Engineer',                                           description:'Experience serving as the engineer of complex technology implementations in a product-centric environment. Comfortable with bridging the gap between legacy development or operations teams and working toward a shared culture and vision. Works tirelessly to arm developers with the best tools and ensuring system uptime and performance.'},
		{key:'c06', id:'digital-performance-analyst',                            text:'Digital Performance Analyst',                               description:'Experience specifying, collecting, and presenting key performance data and analysis for a given digital service. Supports Product Managers by generating new and useful information and translating it into actions that will allow them to iteratively improve their service for users. Possesses analytical and problem-solving skills necessary for quickly developing recommendations based on the quantitative and qualitative evidence gathered via web analytics, financial data, and user feedback. Confident in explaining technical concepts to senior officials with limited technological background. And comfortable working with data, from gathering and analysis through to design and presentation.'},
		{key:'c07', id:'frontend-web-developer',                                 text:'Frontend Web Developer',                                    description:'Experience using modern, frontend web development tools, techniques, and methods for the creation and deployment of user-facing interfaces. Is comfortable working in an agile and lean environment to routinely deploy changes.'},
		{key:'c08', id:'interaction-designer-user-researcher-usability-tester',  text:'Interaction Designer / User Researcher / Usability Tester', description:'The Interaction Designer / User Researcher / Usability Tester is part of a highly collaborative, multi-disciplinary team focused on improving usability, user experience, and driving user adoption and engagement. They are responsible for conducting user research, analysis & synthesis, persona development, interaction design, and usability testing to create products that delight our customers.'},
		{key:'c09', id:'product-manager',                                        text:'Product Manager',                                           description:'Experience managing the delivery, ongoing success, and continuous improvement of one or more digital products and/or platforms.'},
		{key:'c10', id:'security-engineer',                                      text:'Security Engineer',                                         description:'Experience serving as the security engineer of complex technology implementations in a product-centric environment. Comfortable with bridging the gap between legacy development or operations teams and working toward a shared culture and vision. Works tirelessly to ensure help developers create the most secure systems in the world while enhancing the privacy of all system users. Experience with white-hat hacking and fundamental computer science concepts strongly desired.'},
		{key:'c11', id:'technical-architect',                                    text:'Technical Architect',                                       description:'Experience serving as the manager of complex technology implementations, with an eye toward constant reengineering and refactoring to ensure the simplest and most elegant system possible to accomplish the desired need.Understands how to maximally leverage the open source community to deploy systems on infrastructure as a service providers. Comfortable with liberally sharing knowledge across a multi-disciplinary team and working within agile methodologies. A full partner in the determination of vision, objectives, and success criteria.'},
		{key:'c12', id:'visual-designer',                                        text:'Visual Designer',                                           description:'The Visual Designer starts with a deep understanding of the goals of customers and the business so that they can create experiences that delight. Visual Designers will be well-versed in all aspects of current visual design standards and trends and will be responsible for managing project design reviews, resource planning, and execution for all project work related to visual design.'},
		{key:'c13', id:'writer-content-designer-content-strategist',             text:'Writer / Content Designer / Content Strategist',            description:'Experience developing the strategy and execution of content across digital channels.'}
	];
	var capabilitiesObject = {
			list: capabilities,
			bykey : capabilities.reduce (function (accum, current) {accum[current.key]=current;return accum;}, {})
	};


	angular.module('core')

	.factory ('dataService', function () {
		return {
			cities: citylist,
			capabilities : capabilitiesObject,
			questions : [
				'When you are old, what do you think children will ask you to tell stories about?',
				'If your job gave you a surprise three day paid break to rest and recuperate, what would you do with those three days?',
				'What’s the best / worst practical joke that you’ve played on someone or that was played on you?',
				'If you were moving to another country, but could only pack one carry-on sized bag, what would you pack?',
				'What’s something that everyone, absolutely everyone, in the entire world can agree on?'
			]
		};
	})


	;
}());

