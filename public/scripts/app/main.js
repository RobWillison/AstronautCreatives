var Vue = new Vue({
	el: '#app',

	data: {
		orbiting: false,
		test: '100px',
		viewpoint: {
			x: 0,
			y: 0
		},
		solarsystem: {
			width: 1000,
			height: 1000
		},
		planets: {
			home: {
				el: '#home',
				left: 0,
				top: 0
			},
			contact: {
				el: '#contact',
				left: 0,
				top: 0
			},
			portfolio: {
				el: '#portfolio',
				left: 0,
				top: 0
			},
			team: {
				el: '#team',
				left: 0,
				top: 0
			},
			teamm1: {
				el: '#team-m1',
				left: 0,
				top: 0
			},
			teamm2: {
				el: '#team-m2',
				left: 0,
				top: 0
			},
			teamm3: {
				el: '#team-m3',
				left: 0,
				top: 0
			}
		},
		spaceship: {
			el: '#spaceship',
			left: 0,
			top: 0,
			angle: 0,
			speed: 10,
		}
	},

	ready: function () {
		setInterval(this.renderScreen, 50);
	},

	methods: {
		setPositions: function () {
			this.solarsystem.width = $(window).width() * 3;
			this.solarsystem.height = $(window).height() * 3;

			this.planets.home.x = this.solarsystem.width / 2;
			this.planets.home.y = this.solarsystem.height / 2;
			this.planets.home.radius = $(this.planets.home.el).width() / 2;

			this.planets.contact.x = this.solarsystem.width * 7/10 ;
			this.planets.contact.y = this.solarsystem.height * 1/4;
			this.planets.contact.radius = $(this.planets.contact.el).width() / 2;

			this.planets.portfolio.x = this.solarsystem.width * 3/10 ;
			this.planets.portfolio.y = this.solarsystem.height * 3/4;
			this.planets.portfolio.radius = $(this.planets.portfolio.el).width() / 2;

			this.planets.team.x = this.solarsystem.width * 3/10 ;
			this.planets.team.y = this.solarsystem.height * 1/4;
			this.planets.team.radius = $(this.planets.team.el).width() / 2;

			this.planets.teamm1.x = this.solarsystem.width * 2.5/10 ;
			this.planets.teamm1.y = this.solarsystem.height * 0.6/4;
			this.planets.teamm1.radius = $(this.planets.team.el).width() / 2;

			this.planets.teamm2.x = this.solarsystem.width * 2/10 ;
			this.planets.teamm2.y = this.solarsystem.height * 0.8/4;
			this.planets.teamm2.radius = $(this.planets.team.el).width() / 2;

			this.planets.teamm3.x = this.solarsystem.width * 2.4/10 ;
			this.planets.teamm3.y = this.solarsystem.height * 1.5/4;
			this.planets.teamm3.radius = $(this.planets.team.el).width() / 2;

			this.spaceship.x = $(window).width() / 2;
			this.spaceship.y = $(window).height() / 2;
		},
		renderScreen: function () {
			this.setPositions();
			this.renderPlanets();

			this.checkDistances();

			if (this.orbiting) {
				this.spaceship.left = this.spaceship.x  - $('#spaceship').width() / 2;
				this.spaceship.top = this.spaceship.y - $('#spaceship').height() * 3/4;
				return;
			}

			stepX = Math.sin(this.spaceship.angle * Math.PI / 180) * this.spaceship.speed;
			stepY = - Math.cos(this.spaceship.angle * Math.PI / 180) * this.spaceship.speed;

			if (this.viewpoint.x <= 0) { this.viewpoint.x = 0}
			if (this.viewpoint.x >= this.solarsystem.width - $(window).width()) { this.viewpoint.x = this.solarsystem.width - $(window).width()}
			if (this.viewpoint.y <= 0) { this.viewpoint.y = 0}
			if (this.viewpoint.y >= this.solarsystem.height - $(window).height()) { this.viewpoint.y = this.solarsystem.height - $(window).height()}


			this.viewpoint.x += stepX;
			this.viewpoint.y += stepY;


			this.spaceship.left = this.spaceship.x  - $('#spaceship').width() / 2;
			this.spaceship.top = this.spaceship.y - $('#spaceship').height() * 3/4;

		},
		renderPlanets: function(){
			for (var planet in this.planets) {
				var planet = this.planets[planet];

				planet.left = planet.x - this.viewpoint.x  - $(planet.el).width() / 2;
				planet.top = planet.y - this.viewpoint.y - $(planet.el).height() / 2;
			}

			$('#background-back').css('left', - this.viewpoint.x / 3 +'px');
			$('#background-back').css('top', - this.viewpoint.y / 3 + 'px');

			$('#background-front').css('left', - this.viewpoint.x / 2 +'px');
			$('#background-front').css('top', - this.viewpoint.y / 2 + 'px');
		},
		mouseMove: function (event) {
			if (!this.orbiting) {
				mouseX = event.clientX;
				mouseY = event.clientY;

				distanceY = this.spaceship.top - mouseY;
				distanceX = this.spaceship.left - mouseX;

				this.spaceship.angle = -Math.atan2(distanceX, distanceY) * 180 / Math.PI;
			}
		},
		checkDistances: function () {
			for(var planet in this.planets) {
				planet = this.planets[planet];
				var distanceY = planet.top + ($(planet.el).height() / 2) - this.spaceship.y;
				var distanceX = planet.left + ($(planet.el).width() / 2) - this.spaceship.x;

				var distance = Math.sqrt((distanceX * distanceX + distanceY * distanceY));

				if ( distance <= planet.radius * 5/4) {
					//this.orbit(planet, distanceX, distanceY);
				}
			}4
		},
		orbit: function (planet, distanceX, distanceY) {
			this.orbiting = true;
			this.spaceship.speed = 0;

			this.spaceship.angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;

			this.spaceship.angle -= 1;

			distanceY = Math.sin(this.spaceship.angle * Math.PI / 180) * planet.radius;
			distanceX = Math.cos(this.spaceship.angle * Math.PI / 180) * planet.radius;

			this.spaceship.x = planet.x + distanceX;
			this.spaceship.y = planet.y + distanceY;

			this.spaceship.angle = - Math.atan2(distanceX, distanceY) * 180 / Math.PI;
		},
		mouseDown: function (event) {
			this.spaceship.speed=20;
		},
		mouseUp: function (event) {
			this.spaceship.speed=10;
		},
	}
});
