var Vue = new Vue({
	el: '#app',

	data: {
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

			}
		},
		spaceship: {
			left: 0,
			top: 0,
			angle: 0
		}
	},

	ready: function () {
		var timer = setInterval(this.renderScreen, 30);
	},

	methods: {
		setPositions: function () {
			this.solarsystem.width = $(window).width() * 5;
			this.solarsystem.height = $(window).height() * 5;

			this.planets.home.top = this.solarsystem.height / 2;
			this.planets.home.left = this.solarsystem.width / 2;

			this.spaceship.top = $(window).height() / 2;
			this.spaceship.left = $(window).width() / 2;
		},
		renderScreen: function () {
			this.setPositions();
			this.renderPlanets();

			$('#spaceship').css('left', this.spaceship.left  - $('#spaceship').width() / 2 + 'px');
			$('#spaceship').css('top', this.spaceship.top - $('#spaceship').height() * 3/4 + 'px');
			$('#spaceship').css('transform', 'rotate(' + this.spaceship.angle + 'deg)');
		},
		renderPlanets: function(){
			$('#home').css('left', this.planets.home.left  - $('#home').width() / 2 + 'px');
			$('#home').css('top', this.planets.home.top - $('#home').height() / 2 + 'px');
		},
		mouseMove: function (event) {
			mouseX = event.clientX;
			mouseY = event.clientY;

			distanceY = this.spaceship.top - mouseY;
			distanceX = this.spaceship.left - mouseX;

			this.spaceship.angle = - Math.atan2(distanceX, distanceY) * 180 / Math.PI;
		}
	}
});