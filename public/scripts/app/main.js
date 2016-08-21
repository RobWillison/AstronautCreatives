var Vue = new Vue({
	el: '#app',

	data: {
		pixels: [],
		canvas: {
			width: 0,
			height: 0,
			pixelsize: 1,
		}
	},

	ready: function () {
		this.canvas.object = document.getElementById("myCanvas");
		this.canvas.width = this.canvas.object.width;
		this.canvas.height = this.canvas.object.height;
		this.setupPixelArray()

		this.drawOnCanvas();
	},

	methods: {
		drawOnCanvas: function () {
			var ctx = this.canvas.object.getContext("2d");


			this.pixels.forEach(function (item) {
				item.forEach(function (pixel) {
					ctx.fillStyle = pixel.colour;
					ctx.fillRect(pixel.x,pixel.y,pixel.width,pixel.width);
				})
			});
		},
		setupPixelArray: function () {
			this.pixels = [];
			for (x = 0; x < this.canvas.width; x += this.canvas.pixelsize) {
				row = [];
				for (y = 0; y < this.canvas.height; y += this.canvas.pixelsize) {
					colour = getRandomColor();
					row.push({
						x: x,
						y: y,
						width: this.canvas.pixelsize,
						colour: colour});
				}
				this.pixels.push(row);
			}
		},
		wheelchange: function (event) {
			direction = event.wheelDelta / 120;

			this.canvas.pixelsize += direction;
			if (this.canvas.pixelsize <= 0) {
				this.canvas.pixelsize = 1;
			}
			this.setupPixelArray();
			this.drawOnCanvas();
		}
	}
});

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}