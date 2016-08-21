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

			this.planets.home.top = this.solarsystem.height / 2;
			this.planets.home.left = this.solarsystem.width / 2;

			this.spaceship.top = $(window).height() / 2;
			this.spaceship.left = $(window).width() / 2;
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

			console.log(this.planets.home.left - this.viewpoint.x, this.planets.home.top - this.viewpoint.y);

			$('#spaceship').css('left', this.spaceship.left  - $('#spaceship').width() / 2 + 'px');
			$('#spaceship').css('top', this.spaceship.top - $('#spaceship').height() * 3/4 + 'px');
			$('#spaceship').css('transform', 'rotate(' + this.spaceship.angle + 'deg)');
		},
		renderPlanets: function(){
			$('#home').css('left', this.planets.home.left - this.viewpoint.x  - $('#home').width() / 2 + 'px');
			$('#home').css('top', this.planets.home.top - this.viewpoint.y - $('#home').height() / 2 + 'px');

			$('#background-back').css('left', - this.viewpoint.x / 3 +'px');
			$('#background-back').css('top', - this.viewpoint.y / 3 + 'px');

			$('#background-front').css('left', - this.viewpoint.x / 2 +'px');
			$('#background-front').css('top', - this.viewpoint.y / 2 + 'px');
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