// Helper functions

// Copy to clipboard (using temporary textarea)
const copyToClipboard = function(str) {
	var tempEl = document.createElement("textarea");
	tempEl.value = str;
	document.body.appendChild(tempEl);
	tempEl.select();
	document.execCommand("copy");
	document.body.removeChild(tempEl);
}

// Fading in and out (from Gabriel Romanato)
const FX = {
	easing: {
		linear: function(progress) {
			return progress;
		},
		quadratic: function(progress) {
			return Math.pow(progress, 2);
		},
		swing: function(progress) {
			return 0.5 - Math.cos(progress * Math.PI) / 2;
		},
		circ: function(progress) {
			return 1 - Math.sin(Math.acos(progress));
		},
		back: function(progress, x) {
			return Math.pow(progress, 2) * ((x + 1) * progress - x);
		},
		bounce: function(progress) {
			for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
				if (progress >= (7 - 4 * a) / 11) {
					return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
				}
			}
		},
		elastic: function(progress, x) {
				return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
		}
	},
	animate: function(options) {
		var start = new Date;
		var id = setInterval(function() {
			var timePassed = new Date - start;
			var progress = timePassed / options.duration;
			if (progress > 1) {
				progress = 1;
			}
			options.progress = progress;
			var delta = options.delta(progress);
			options.step(delta);
			if (progress == 1) {
				clearInterval(id);
				options.complete();
			}
		}, options.delay || 10);
	},
	fadeOut: function(element, options) {
		var to = 1;
		this.animate({
			duration: options.duration,
			delta: function(progress) {
				progress = this.progress;
				return FX.easing.swing(progress);
			},
			complete: options.complete,
			step: function(delta) {
				element.style.opacity = to - delta;
			}
		});
		setTimeout(function() {
			element.style.display = "none";
		}, options.duration);
	},
	fadeIn: function(element, options) {
		var to = 0;
		element.style.display = "initial";
		this.animate({
			duration: options.duration,
			delta: function(progress) {
				progress = this.progress;
				return FX.easing.swing(progress);
			},
			complete: options.complete,
			step: function(delta) {
				element.style.opacity = to + delta;
			}
		});
	}
};

// Shorthand for getting elements by ID
const get = id => document.getElementById(id);

// Check if a value is undefined
const isUndefined = v => typeof v === "undefined";

// Get a random BigInt from [0,range) 
const randBigInt = function(range) {
	do
	{
		var rand = [];
		var rangeLen = (range - 1n).toString().length;
		var digitGroups = rangeLen / 9 + 2 | 0;
		while (digitGroups--)
		{
			rand.push(("" + (Math.random() * 1000000000 | 0)).padStart(9, "0"));
		}
		var result = BigInt(rand.join("").substring(0,rangeLen));
	} while (result >= range);
	
	return result;
}

// Now the REAL code begins

window.onload = function() {
	// Nothing yet!
}