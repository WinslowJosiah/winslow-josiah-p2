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

// Make HTMLCollections forEach-able
if (!HTMLCollection.prototype.forEach)
{
	HTMLCollection.prototype.forEach = function(callback, thisArg) {
		if (isUndefined(thisArg)) thisArg = this;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

// Check if string is either undefined or full of whitespace
if (!String.prototype.isNullOrWhitespace)
{
	String.prototype.isNullOrWhitespace = function() {
		if (isUndefined(this) || this == null) return true;
		return this.replace(/\s/g, "").length < 1;
	};
}

// "Other" things

// Gematrimax command definitions
var gmxCommands = [
	{
		val: 1,
		cmd: "[",
		desc: "loop while top of stack is nonzero (tested before start)",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			// If value is nonzero...
			if (val != 0)
			{
				// Push onto the address stack
				this.addressStack.push(this.instructionPointer);
			}
			else
			{
				// Skip to matching end-while
				var nestDepth = 0;
				while (true)
				{
					this.instructionPointer++;
					if (["[", "_["].includes(this.commands[this.instructionPointer].cmd))
					{
						nestDepth++;
					}
					else if (["]"].includes(this.commands[this.instructionPointer].cmd))
					{
						nestDepth--;
						if (nestDepth < 0) break;
					}
				}
			}
		}
	},
	{
		val: 2,
		cmd: "_[",
		desc: "loop while top of stack is nonzero (tested after end)",
		func: function(argc, argv) {
			this.addressStack.push(this.instructionPointer);
		}
	},
	{
		val: 3,
		cmd: "]",
		desc: "end while loop",
		func: function(argc, argv) {
			var loopBackPointer = this.addressStack.pop();
			
			// If this is a while loop...
			if ("[" == this.commands[loopBackPointer].cmd)
			{
				this.instructionPointer = loopBackPointer - 1;
			}
			// If this is a do-while loop...
			else if ("_[" == this.commands[loopBackPointer].cmd)
			{
				var val = this.stack.pop();
				if (isUndefined(val))
				{
					setError("ERROR: Can't pop from empty stack");
					this.programExecuting = false;
					return;
				}
				if (val != 0)
				{
					this.instructionPointer = loopBackPointer - 1;
				}
			}
		}
	},
	{
		val: 4,
		cmd: "#",
		desc: "push (number)",
		func: function(argc, argv) {
			this.stack.push(BigInt(argv[0]));
		}
	},
	{
		val: 5,
		cmd: "=",
		desc: "push the stack's length",
		func: function(argc, argv) {
			this.stack.push(BigInt(this.stack.length));
		}
	},
	{
		val: 6,
		cmd: "?",
		desc: "pop n, then push a random number from 0 to n",
		func: function(argc, argv) {
			var randMax = this.stack.pop();
			if (isUndefined(randMax))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			if (randMax <= 0)
			{
				setError("ERROR: Upper bound for random integer must be positive");
				this.programExecuting = false;
				return;
			}
			this.stack.push(randBigInt(randMax));
		}
	},
	{
		val: 7,
		cmd: ";",
		desc: "pop a value from the stack and discard",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
		}
	},
	{
		val: 8,
		cmd: "+",
		desc: "add the top two stack values, then push the result",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a + b);
		}
	},
	{
		val: 9,
		cmd: "-",
		desc: "subtract the top stack value from the second-from-top stack value, then push the result",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a - b);
		}
	},
	{
		val: 10,
		cmd: "*",
		desc: "mutiply the top two stack values, then push the result",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a * b);
		}
	},
	{
		val: 11,
		cmd: "/",
		desc: "divide the second-from-top stack value by the top stack value, then push the result",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			// Special case to handle division by 0 (which is illegal)
			if (b == 0)
			{
				setError("ERROR: Can't divide by zero");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a / b);
		}
	},
	{
		val: 12,
		cmd: "%",
		desc: "modulo the second-from-top stack value by the top stack value, then push the result",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			// Special case to handle modulo 0 (which is illegal)
			if (b == 0)
			{
				setError("ERROR: Can't modulo by zero");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a % b);
		}
	},
	{
		val: 13,
		cmd: "!",
		desc: "pop n, then push 1 if n is 0, otherwise push 0",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(BigInt(val == 0 ? 1 : 0));
		}
	},
	{
		val: 14,
		cmd: "$",
		desc: "discard the lower of the two top stack values",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			// Can't use Math.max() because these are BigInts
			this.stack.push(a > b ? a : b);
		}
	},
	{
		val: 15,
		cmd: "&",
		desc: "duplicate the top stack value",
		func: function(argc, argv) {
			var a = this.stack.pop();
			if (isUndefined(a))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(a);
			this.stack.push(a);
		}
	},
	{
		val: 16,
		cmd: ">",
		desc: "pop n, then push a copy of the nth stack value from the top",
		func: function(argc, argv) {
			var pointer = this.stack.pop();
			if (isUndefined(pointer))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			pointer = Number(pointer);
			if (!(pointer >= 0 && pointer < this.stack.length))
			{
				setError("ERROR: Stack index out of range");
				this.programExecuting = false;
				return;
			}
			this.stack.push(this.stack[this.stack.length - 1 - pointer]);
		}
	},
	{
		val: 17,
		cmd: "<",
		desc: "pop n, then push a copy of the nth stack value from the bottom",
		func: function(argc, argv) {
			var pointer = this.stack.pop();
			if (isUndefined(pointer))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			pointer = Number(pointer);
			if (!(pointer >= 0 && pointer < this.stack.length))
			{
				setError("ERROR: Stack index out of range");
				this.programExecuting = false;
				return;
			}
			this.stack.push(this.stack[pointer]);
		}
	},
	{
		val: 18,
		cmd: "\\",
		desc: "swap the top two stack values",
		func: function(argc, argv) {
			var b = this.stack.pop();
			var a = this.stack.pop();
			if (isUndefined(a) || isUndefined(b))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			this.stack.push(b);
			this.stack.push(a);
		}
	},
	{
		val: 19,
		cmd: ")",
		desc: "rotate the entire stack, shifting the top value down to the bottom",
		func: function(argc, argv) {
			this.stack = rotateTopToBottom.call(this, this.stack);
		}
	},
	{
		val: 20,
		cmd: "(",
		desc: "rotate the entire stack, shifting the bottom value up to the top",
		func: function(argc, argv) {
			this.stack = rotateBottomToTop.call(this, this.stack);
		}
	},
	{
		val: 21,
		cmd: "}",
		desc: "pop n, then rotate the top n stack values, shifting the top value down to the bottom",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			if (val == 0)
			{
				setError("Can't rotate 0 values");
				this.programExecuting = false;
				return;
			}
			else if (val < 0)
			{
				setError("Can't rotate a negative number of values");
				this.programExecuting = false;
				return;
			}
			else
			{
				// This is to ensure that we only rotate as many values as are on the stack
				if (val > this.stack.length) val = BigInt(this.stack.length);
				var rotated = [];
				for (var i = 0; i < val; i++)
				{
					var a = this.stack.pop();
					if (isUndefined(a))
					{
						setError("ERROR: Can't pop from empty stack");
						this.programExecuting = false;
						return;
					}
					rotated.unshift(a);
				}
				rotated = rotateTopToBottom.call(this, rotated);
				this.stack = this.stack.concat(rotated);
			}
		}
	},
	{
		val: 22,
		cmd: "{",
		desc: "pop n, then rotate the top n stack values, shifting the bottom value up to the top",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			if (val == 0)
			{
				setError("Can't rotate 0 values");
				this.programExecuting = false;
				return;
			}
			else if (val < 0)
			{
				setError("Can't rotate a negative number of values");
				this.programExecuting = false;
				return;
			}
			else
			{
				// This is to ensure that we only rotate as many values as are on the stack
				if (val > this.stack.length) val = BigInt(this.stack.length);
				var rotated = [];
				for (var i = 0; i < val; i++)
				{
					var a = this.stack.pop();
					if (isUndefined(a))
					{
						setError("ERROR: Can't pop from empty stack");
						this.programExecuting = false;
						return;
					}
					rotated.unshift(a);
				}
				rotated = rotateBottomToTop.call(this, rotated);
				this.stack = this.stack.concat(rotated);
			}
		}
	},
	{
		val: 23,
		cmd: ",",
		desc: "take one Unicode codepoint as input and push it onto the stack",
		func: function(argc, argv) {
			if (this.eofReached)
			{
				this.stack.push(BigInt(-1));
			}
			else
			{
				this.stack.push(BigInt(this.inputCodepoints[this.inputPointer].codePointAt(0)));
				this.inputPointer++;
				if (this.inputPointer >= this.inputCodepoints.length) this.eofReached = true;
			}
		}
	},
	{
		val: 24,
		cmd: ".",
		desc: "output the top stack value as a Unicode codepoint and discard it",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			// If the number is not within valid Unicode codepoint range...
			if (!(val >= 0 && val < 1114112))
			{
				setError("ERROR: Unicode codepoint out of range");
				this.programExecuting = false;
				return;
			}
			addToOutput(String.fromCodePoint(Number(val)));
		}
	},
	{
		val: 25,
		cmd: ":",
		desc: "output the top stack value as a number and discard it",
		func: function(argc, argv) {
			var val = this.stack.pop();
			if (isUndefined(val))
			{
				setError("ERROR: Can't pop from empty stack");
				this.programExecuting = false;
				return;
			}
			addToOutput(val.toString());
		}
	},
	{
		val: 26,
		cmd: "@",
		desc: "end the program here",
		func: function(argc, argv) {
			this.programExecuting = false;
		}
	}
];

// Helper functions for Gematrimax commands
function rotateTopToBottom(arr) {
	var a = arr.pop();
	if (isUndefined(a))
	{
		setError("ERROR: Can't rotate empty stack");
		this.programExecuting = false;
		return;
	}
	arr.unshift(a);
	
	return arr;
}

function rotateBottomToTop(arr) {
	var a = arr.shift();
	if (isUndefined(a))
	{
		setError("ERROR: Can't rotate empty stack");
		this.programExecuting = false;
		return;
	}
	arr.push(a);
	
	return arr;
}

// Convert a word to a gematria value
function gematria(word) {
	// Conversion table
	var letters = {
		"a": 1,
		"b": 2,
		"c": 3,
		"d": 4,
		"e": 5,
		"f": 6,
		"g": 7,
		"h": 8,
		"i": 9,
		"j": 10,
		"k": 11,
		"l": 12,
		"m": 13,
		"n": 14,
		"o": 15,
		"p": 16,
		"q": 17,
		"r": 18,
		"s": 19,
		"t": 20,
		"u": 21,
		"v": 22,
		"w": 23,
		"x": 24,
		"y": 25,
		"z": 26
	};
	
	// Remove accents and diacritics
	word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	// Turn word lowercase
	word = word.toLowerCase();
	// Sum up the values of the letters
	sum = 0n;
	for (var i = 0; i < word.length; i++)
	{
		if (letters[word[i]]) sum += BigInt(letters[word[i]]);
	}
	return sum;
}

// Encode TIO state to URL
function TIOStateToURL(tioState) {
	return byteStringToBase64(byteArrayToByteString(pako.deflateRaw(byteStringToByteArray(tioState.join("\xff")), {"level": 9})));
}

// Decode TIO state from URL
function URLToTIOState(url) {
	// Decode it
	tioState = byteArrayToByteString(pako.inflateRaw(base64ToByteString(url)));
	// Split it on \xFF characters
	tioState = tioState.split("\xff");
	return tioState;
}

// These functions are stolen from TIO.run
function textToByteString(string) {
	return unescape(encodeURIComponent(string));
}

function byteStringToText(byteString) {
	return decodeURIComponent(escape(byteString));
}

function byteStringToBase64(byteString) {
	return btoa(byteString).replace(/\+/g, "@").replace(/=+/, "");
}

function base64ToByteString(base64String) {
	return atob(unescape(base64String).replace(/@|-/g, "+").replace(/_/g, "/"));
}

function byteArrayToByteString(byteArray) {
	var retval = "";
	iterate(byteArray, function(byte) { retval += String.fromCharCode(byte); });
	return retval;
}

function byteStringToByteArray(byteString) {
	var byteArray = new Uint8Array(byteString.length);
	for(var index = 0; index < byteString.length; index++)
		byteArray[index] = byteString.charCodeAt(index);
	byteArray.head = 0;
	return byteArray;
}

function iterate(iterable, monad) {
	if (!iterable)
		return;
	for (var i = 0; i < iterable.length; i++)
		monad(iterable[i]);
}

// Now the REAL code begins

// Get path of TIO page relative to this script's path
var tioPage = document.currentScript.src;
tioPage = tioPage.substr(0, tioPage.lastIndexOf("/") + 1);
tioPage = tioPage + "../tio/index.html";

window.onload = function() {
	// Place a TIO link in each code tag
	document.getElementsByTagName("code").forEach(function(el) {
		// Create a link...
		var tioLink = document.createElement("a");
		// ...that's styled how we want it to be...
		tioLink.classList.add("tio-message");
		// ...that brings us to a new tab...
		tioLink.setAttribute("target", "_blank");
		// ...that autofills with the right code...
		tioLink.setAttribute("href", tioPage + "?" + TIOStateToURL([
			// The code
			textToByteString(el.textContent),
			// The input ("" if the attribute doesn't exist)
			textToByteString(el.getAttribute("data-tio-input") || ""),
			// Either of "good" or "bad" depending on if this attribute exists
			textToByteString(el.hasAttribute("data-tio-cheatmode") ? "good" : "bad")
		]));
		// ...and that we insert just before the end of the code element
		el.insertAdjacentElement("beforeend", tioLink);
	});
}