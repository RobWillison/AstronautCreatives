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
				top: 0,
				initialPosition: {
					x: 0.5,
					y: 0.5
				}
			},
			contact: {
				el: '#contact',
				left: 0,
				top: 0,
				initialPosition: {
					x: 7/10,
					y: 1/4
				}
			},
			portfolio: {
				el: '#portfolio',
				left: 0,
				top: 0,
				initialPosition: {
					x: 3/10,
					y: 3/4
				}
			},
			team: {
				el: '#team',
				left: 0,
				top: 0,
				initialPosition: {
					x: 3/10,
					y: 1/4
				}
			},
			teamm1: {
				el: '#teamm1',
				left: 0,
				top: 0,
				initialPosition: {
					x: 2.5/10,
					y: 0.6/4
				}
			},
			teamm2: {
				el: '#teamm2',
				left: 0,
				top: 0,
				initialPosition: {
					x: 2/10,
					y: 0.8/4
				}
			},
			teamm3: {
				el: '#teamm3',
				left: 0,
				top: 0,
				initialPosition: {
					x: 2.4/10,
					y: 1.5/4
				}
			}
		},
		spaceship: {
			el: '#spaceship',
			left: 0,
			top: 0,
			angle: 0,
			speed: 10,
			height: 100,
			width: 50,
		},
		mouse: {
			x: 0,
			y: 0
		}
	},

	ready: function () {
		this.animationFunction = setInterval(this.renderScreen, 50);
	},

	methods: {
		setPositions: function () {
			this.solarsystem.width = $(window).width() * 3;
			this.solarsystem.height = $(window).height() * 3;

			for (var planet in this.planets) {
				planet = this.planets[planet];

				planet.x = this.solarsystem.width * planet.initialPosition.x;
				planet.y = this.solarsystem.height * planet.initialPosition.y;
				planet.radius = $(planet.el).width() / 2;
			}

			this.spaceship.x = $(window).width() / 2;
			this.spaceship.y = $(window).height() / 2;
		},
		renderScreen: function () {
			this.setPositions();
			this.renderPlanets();

			stepX = Math.sin(this.spaceship.angle * Math.PI / 180) * this.spaceship.speed;
			stepY = - Math.cos(this.spaceship.angle * Math.PI / 180) * this.spaceship.speed;

			if (this.viewpoint.x <= 0) { this.viewpoint.x = 0}
			if (this.viewpoint.x >= this.solarsystem.width - $(window).width()) { this.viewpoint.x = this.solarsystem.width - $(window).width()}
			if (this.viewpoint.y <= 0) { this.viewpoint.y = 0}
			if (this.viewpoint.y >= this.solarsystem.height - $(window).height()) { this.viewpoint.y = this.solarsystem.height - $(window).height()}


			this.viewpoint.x += stepX;
			this.viewpoint.y += stepY;

			mouseAngle = - Math.atan2(this.spaceship.x - this.mouse.x, this.spaceship.y - this.mouse.y) * 180/Math.PI;

			if (mouseAngle < 0) {
				mouseAngle = 360 + mouseAngle;
			}

			a = mouseAngle - this.spaceship.angle;
			while (a > 180) {
				a -= 360;
			}
			while (a < -180) {
				a += 360;
			}

			console.log(a);

			if (a < -5) {
				this.spaceship.angle -= 5;
			} else if (a > 5){
				this.spaceship.angle += 5;
			}

			this.spaceship.left = this.spaceship.x  - $('#spaceship').width() / 2;
			this.spaceship.top = this.spaceship.y - $('#spaceship').height() / 2;

		},
		renderPlanets: function(){
			for (var planet in this.planets) {
				var planet = this.planets[planet];

				planet.left = (planet.x - this.viewpoint.x) - planet.radius;
				planet.top = (planet.y - this.viewpoint.y) - planet.radius;
			}

			$('#background-back').css('left', - this.viewpoint.x / 3 +'px');
			$('#background-back').css('top', - this.viewpoint.y / 3 + 'px');

			$('#background-front').css('left', - this.viewpoint.x / 2 +'px');
			$('#background-front').css('top', - this.viewpoint.y / 2 + 'px');
		},
		mouseMove: function (event) {
			this.mouse.x = event.screenX;
			this.mouse.y = event.screenY;
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
			}
		},
		orbit: function (event) {

			planet = $(event.srcElement).context.id;
			planet = planet.replace('-image', '');
			planet = this.planets[planet];
			console.log(planet);
			//point at center of planet.
			this.spaceship.angle = - Math.atan2(this.spaceship.x - (planet.x - this.viewpoint.x), this.spaceship.y - (planet.y - this.viewpoint.y)) * 180/Math.PI;

			oposite = planet.radius;
			adjacent = Math.sqrt(Math.pow(this.spaceship.x - (planet.x - this.viewpoint.x), 2) + Math.pow(this.spaceship.y - (planet.y - this.viewpoint.y), 2))

			adjustmentAngle = Math.atan2(oposite, adjacent) * 180/Math.PI;
			console.log(planet.radius, adjustmentAngle);
			this.spaceship.angle += adjustmentAngle;

			var self = this;
			var initialShipHeight = this.spaceship.height;
			var initialShipWidth = this.spaceship.width;
			var animationConfig = {
				scaleHeightStep: (initialShipHeight * 0.25) / (adjacent / self.spaceship.speed),
				scaleWidthStep: (initialShipWidth * 0.25) / (adjacent / self.spaceship.speed)
			}

			orbitAnimation = function () {
				if (adjacent < 0) {
					return;
				}
				
				//so in adjacent pixels drop to 1/4 size
				scaleSpeed = 0.25 / (adjacent / self.spaceship.speed);

				self.spaceship.height -= animationConfig.scaleHeightStep;
				self.spaceship.width -= animationConfig.scaleWidthStep;

				adjacent -= self.spaceship.speed;

				stepX = Math.sin(self.spaceship.angle * Math.PI / 180) * self.spaceship.speed;
				stepY = - Math.cos(self.spaceship.angle * Math.PI / 180) * self.spaceship.speed;

				self.spaceship.x += stepX;
				self.spaceship.y += stepY;


				self.spaceship.left = self.spaceship.x  - self.spaceship.width / 2;
				self.spaceship.top = self.spaceship.y - self.spaceship.height / 2
			}

			clearInterval(this.animationFunction);
			this.animationFunction = setInterval(orbitAnimation, 50);


			//apply transform to start of orbit
			//rotate around planet

			
		},
		mouseDown: function (event) {
			this.spaceship.speed=20;
		},
		mouseUp: function (event) {
			this.spaceship.speed=10;
		},
	}
});
