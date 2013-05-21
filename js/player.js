var player = (function() {
	var self = {
		setVars: function() {
			self.v = document.getElementById('player');
			self.$v = $(self.v);
			self.width = self.$v.width();
			self.pps = self.v.duration / self.width;
			self.curTime = self.v.currentTime;
			self.countdown = 250;
			self.interval = 1000 / 60;
			self.taperVals = {};
		},

		init: function() {
			self.setVars();
			self.attachHandlers();
		},

		attachHandlers: function() {
			self.$v.on('move', function(e) {
				var offset = self.pps * e.deltaX,
					newTime = 0;

				if (self.curTime <= self.v.duration && self.curTime >= 0) {
					newTime = self.curTime + offset;

					if (newTime > self.v.duration) {
						self.curTime = self.v.duration
					} else if (newTime < 0) {
						self.curTime = 0;
					} else {
						self.curTime = newTime;
					}
				}

				self.v.currentTime = self.curTime;
			});

			self.$v.on('moveend', function(e) {
				var totalPixels = (e.velocityX * 1000) * (self.countdown / 1000);

				self.taperVals = {
					totalPixels: totalPixels,
					ppf: totalPixels / self.interval,
					pos: totalPixels,
					e: e
				}

				self.taperScroll();
			});

		},

		simpleEasing: function(timePassed) {
			return (1 - Math.cos(timePassed * Math.PI)) / 2;
		},

		taperScroll: function() {
			setTimeout(function() {
				if (self.taperVals.pos > 0) {
					self.taperVals.pos =  self.taperVals.pos - self.taperVals.ppf;
					self.curTime = self.curTime + (self.taperVals.ppf *;

					self.v.currentTime = self.curTime;

					self.taperScroll();
				} else {
					self.taperVals = {};
				}
			},self.interval);
		}
	};

	return self;
})();

player.init();