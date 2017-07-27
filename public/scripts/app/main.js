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
			viewpoint = $('#cornermarker').offset();

			this.solarsystem.width = viewpoint.left * 5;
			this.solarsystem.height = viewpoint.top * 3;

			for (var planet in this.planets) {
				planet = this.planets[planet];

				planet.x = this.solarsystem.width * planet.initialPosition.x;
				planet.y = this.solarsystem.height * planet.initialPosition.y;
				planet.radius = $(planet.el).width() / 2;
			}

			this.spaceship.x = viewpoint.left / 2;
			this.spaceship.y = viewpoint.top / 2;
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


			if (!this.orbiting) {
				if (a < -5) {
					this.spaceship.angle -= 5;
				} else if (a > 5) {
					this.spaceship.angle += 5;
				}
			}

			this.spaceship.left = this.spaceship.x  - this.spaceship.width / 2;
			this.spaceship.top = this.spaceship.y - this.spaceship.height * 1.5;

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

			if (planet == undefined) {
				return;
			}

			this.orbiting = true;

			//point at center of planet.
			this.spaceship.angle = - Math.atan2(this.spaceship.x - (planet.x - this.viewpoint.x), this.spaceship.y - (planet.y - this.viewpoint.y)) * 180/Math.PI;

			oposite = planet.radius;
			adjacent = Math.sqrt(Math.pow(this.spaceship.x - (planet.x - this.viewpoint.x), 2) + Math.pow(this.spaceship.y - (planet.y - this.viewpoint.y), 2));

			adjustmentAngle = Math.atan2(oposite, adjacent) * 180/Math.PI;

			this.spaceship.angle += adjustmentAngle;

			var self = this;
			var initialShipHeight = this.spaceship.height;
			var initialShipWidth = this.spaceship.width;
			this.animationConfig = {
				adjustmentAngle: adjustmentAngle,
				scaleHeightStep: (initialShipHeight * 0.25) / (adjacent / self.spaceship.speed),
				scaleWidthStep: (initialShipWidth * 0.25) / (adjacent / self.spaceship.speed),
				initialShipHeight: initialShipHeight,
				initialShipWidth: initialShipWidth
			};

			orbitAnimation = function () {

				self.spaceship.speed = 10;

				angleDiffrence = 90 - Math.acos(Math.pow(self.spaceship.speed, 2) / (2 * self.spaceship.speed * self.animationConfig.orbitRadius)) * 180/Math.PI;

				self.spaceship.angle -= angleDiffrence * 1.9;

				self.renderScreen();

			};

			enterOrbitAnimation = function () {

				if (adjacent < 0) {
					//self.spaceship.angle -= self.animationConfig.adjustmentAngle;
					self.animationConfig.orbitRadius = planet.radius;

					clearInterval(self.animationFunction);
					self.animationFunction = setInterval(orbitAnimation, 50);
					return;
				}

				self.spaceship.height -= self.animationConfig.scaleHeightStep;
				self.spaceship.width -= self.animationConfig.scaleWidthStep;

				adjacent -= self.spaceship.speed;

				self.renderScreen();
			};

			clearInterval(this.animationFunction);
			this.animationFunction = setInterval(enterOrbitAnimation, 50);


			//apply transform to start of orbit
			//rotate around planet
		},
		exitorbit: function() {
			this.orbiting = false;
			var self = this;
			var exitOrbitAnimation = function () {

				if (self.spaceship.height == self.animationConfig.initialShipHeight) {
					clearInterval(self.animationFunction);
					self.animationFunction = setInterval(self.renderScreen, 50);
				}

				self.spaceship.height += self.animationConfig.scaleHeightStep;
				self.spaceship.width += self.animationConfig.scaleWidthStep;

				self.renderScreen();

			}

			clearInterval(this.animationFunction);
			this.animationFunction = setInterval(exitOrbitAnimation, 50);
		},
		mouseDown: function (event) {
			this.spaceship.speed=20;
		},
		mouseUp: function (event) {
			if (this.orbiting) {
				//Not sure if we want this
				//this.exitorbit();
				return;
			}

			this.spaceship.speed=10;
		},
	}
});
