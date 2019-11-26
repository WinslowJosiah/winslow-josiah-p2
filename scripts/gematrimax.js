var gmxCommands = [
	{
		val: 1,
		cmd: "[",
		desc: "loop while top of stack is nonzero (tested before start)",
		func: function(argc, argv) {
			
		}
	},
	{
		val: 2,
		cmd: "_[",
		desc: "loop while top of stack is nonzero (tested after end)",
		func: function(argc, argv) {
			
		}
	},
	{
		val: 3,
		cmd: "]",
		desc: "end while loop",
		func: function(argc, argv) {
			
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
			var discard = this.stack.pop();
			if (isUndefined(discard))
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
			
		}
	},
	{
		val: 17,
		cmd: "<",
		desc: "pop n, then push a copy of the nth stack value from the bottom",
		func: function(argc, argv) {
			
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
			
		}
	},
	{
		val: 20,
		cmd: "(",
		desc: "rotate the entire stack, shifting the bottom value up to the top",
		func: function(argc, argv) {
			
		}
	},
	{
		val: 21,
		cmd: "}",
		desc: "pop n, then rotate the stack n times, shifting the top value down to the bottom",
		func: function(argc, argv) {
			
		}
	},
	{
		val: 22,
		cmd: "{",
		desc: "pop n, then rotate the stack n times, shifting the bottom value up to the top",
		func: function(argc, argv) {
			
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
			// If the number is within valid Unicode codepoint range...
			if (val >= 0 && val < 1114112)
			{
				addToOutput(String.fromCodePoint(Number(val)));
			}
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
	},
]

window.onload = function() {
	var programEl = get("program-code");
	var inputEl = get("program-input");
	var outputEl = get("program-output");
	var shareTextEl = get("share-text");
	
	var cheatmodeButton = get("button-cheatmode");
	var executeButton = get("button-execute");
	var stopButton = get("button-stop");
	var shareButton = get("button-share");
	
	var cheatmodeText = {
		bad: "Cheat Mode OFF",
		good: "Cheat Mode ON"
	}
	
	// Custom events are cool
	var textChangedEvent = new Event("textChanged");
	
	// Cause all textboxes to resize automatically
	autosize(document.getElementsByTagName("textarea"));
	
	// Try to decode any share data in the URL.
	try {
		// Get the data after the question mark in the URL
		stateString = window.location.href.match(/\?(.+)$/);
		// If there is any...
		if (stateString !== null) {
			// Gather it
			stateString = stateString[1];
			// Decode it
			stateString = byteArrayToByteString(pako.inflateRaw(base64ToByteString(stateString)));
			// Split it on \xFF characters
			stateString = stateString.split("\xff");
			// If the cheatmode button's class is invalid...
			if (!["good","bad"].includes(stateString[2])) {
				// Throw an error
				throw "error";
			}
			// Set the values that were decoded
			programEl.value = byteStringToText(stateString[0]);
			//autosize.update($program);
			inputEl.value = byteStringToText(stateString[1]);
			//autosize.update($input);
			cheatmodeButton.className = byteStringToText(stateString[2]);
		}
	}
	catch (err){
		// Give an error if we could not decode the share data
		console.error("The share data in the URL is malformed, or otherwise undecodable. Be sure it has been copied exactly into the address bar.");
	}
	
	// Click handler for clicking on the "Share" button
	shareButton.onclick = function(e) {
		// Join the texts of the needed values together with an \xFF character
		// We're using UTF-8, and \xFF is a byte that can never occur within a UTF-8 sequence
		stateString = [textToByteString(programEl.value), textToByteString(inputEl.value), textToByteString(cheatmodeButton.className)].join("\xff");
		// If the program textarea is not empty...
		if (!stateString.startsWith("\xff"))
		{
			// Encode the string and place it in the address bar
			history.pushState({}, "", "?" + byteStringToBase64(byteArrayToByteString(pako.deflateRaw(byteStringToByteArray(stateString), {"level": 9}))));
			// Copy it to the clipboard as well
			copyToClipboard(window.location.href);
			// Alert the user by showing the share text
			// Fade in for 250 ms...
			FX.fadeIn(shareTextEl, {
				duration: 250,
				complete: function() {
					// ...then fade out for 250 ms...
					setTimeout(function() {
						FX.fadeOut(shareTextEl, {
							duration: 250,
							complete: function () { }
						});
					// ...after waiting for 250 ms
					}, 250);
				}
			});
		}
	};
	
	// Click handler for clicking on the "Cheat Mode" button
	cheatmodeButton.onclick = function(e) {
		// Switch the class name
		if (this.className == "good")
		{
			this.className = "bad";
		}
		else if (this.className == "bad")
		{
			this.className = "good";
		}
		// The text is changing
		this.dispatchEvent(textChangedEvent);
	};
	
	// Event handler for the text of the Cheat Mode button being changed
	cheatmodeButton.addEventListener("textChanged", function(e) {
		// Simple as that
		this.textContent = cheatmodeText[this.className];
	});
	
	// Cause the right text to show up right away
	cheatmodeButton.dispatchEvent(textChangedEvent);
	
	var execute;
	var interval = null;
	executeButton.onclick = function(e) {
		setOutput("");
		setError("");
		setDone("");
		// Start executing the program, and execute more instructions every millisecond
		execute = executeGematrimax(programEl.value);
		if (interval === null)
		{
			interval = setInterval(function() {
				if (!execute())
				{
					setDone("Done.");
					clearInterval(interval);
					interval = null;
				}
			}, 1);
		}
	}
	
	stopButton.onclick = function(e) {
		// Stop the currently-running program
		if (interval !== null)
		{
			setDone("Stopped.");
			clearInterval(interval);
			interval = null;
		}
	}
	
}

// Execute a Gematrimax program
function executeGematrimax(program) {
	// Create list of commands
	var cmdList;
	if (get("button-cheatmode").className == "good")
	{
		cmdList = gmxCheatmodeToCommandList(program);
	}
	else
	{
		cmdList = gmxProgramToCommandList(program);
	}
	
	// If the command list is undefined, don't keep going
	if (!cmdList) return false;
	
	var executionState = {
		instructionPointer: 0,
		stack: [],
		// Best way to get the codepoints!
		inputCodepoints: [...(get("program-input").value)],
		inputPointer: 0,
		eofReached: false,
		programExecuting: true
	};
	
	return function() {
		for (var i = 0; i < 1; i++)
		{
			var currentCommand = cmdList[executionState.instructionPointer];
			// If there is a command here...
			if (currentCommand)
			{
				// Find the right command to execute...
				gmxCommands.find(
					cmd => cmd.cmd == currentCommand.cmd
				// ...then execute it under the current context
				).func.call(executionState, currentCommand.argv.length, currentCommand.argv.slice());
				
				// Advance forward
				// Don't worry if we advance too far, we have a way of handling that
				executionState.instructionPointer++;
			}
			// If there is no command here...
			else
			{
				executionState.programExecuting = false;
			}
			
			console.log(executionState.stack);
			console.log(executionState.inputCodepoints);
			console.log(`Input pointer: ${executionState.inputPointer}`);
			console.log(`Instruction pointer: ${executionState.instructionPointer}`);
			console.log(`Instruction: ${currentCommand ? currentCommand.cmd : "none"}`);
			console.log(`End of input? ${executionState.eofReached ? "Yes" : "No"}`);
			console.log(`Program still executing? ${executionState.programExecuting ? "Yes" : "No"}`);
			
			// If the program has stopped, we're not still going!
			if (!executionState.programExecuting) return false;
		}
		// We're still going, don't stop me now!
		return true;
	};
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

// Convert a Gematrimax program to a list of commands
function gmxProgramToCommandList(program) {
	// Remove all accents and diacritics
	program = program.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	// Strip all apostrophes
	program = program.replace("'", "");
	// Divide into words that consist of only letters
	var programArr = program.match(/[a-z]+/gi);
	if (!programArr) programArr = [];
	
	// Convert it to a cheat mode program (so I don't have to write *that* conversion code twice)
	var cheatmodeProgram = "";
	var isPushArgument = false;
	var currentCommand;
	for (var i = 0; i < programArr.length; i++)
	{
		var word = programArr[i];
		var gematriaVal = gematria(word);
		// If part of a numerical argument...
		if (isPushArgument)
		{
			currentCommand = "";
			cheatmodeProgram += gematriaVal.toString();
			isPushArgument = false;
		}
		else
		{
			gematriaVal = Number((gematriaVal - 1n) % 26n + 1n);
			currentCommand = gmxCommands.find(cmd => cmd.val == gematriaVal).cmd;
			cheatmodeProgram += currentCommand;
		}
		if (currentCommand == "#") isPushArgument = true;
	}
	
	return gmxCheatmodeToCommandList(cheatmodeProgram);
}

// Convert a Gematrimax Cheat Mode program to a list of commands
function gmxCheatmodeToCommandList(cheatmodeProgram) {
	var pushCommand = /#(x[0-9a-f]+|[0-9]+)/i;
	
	// Strip all comments (strings surrounded by quotes)
	cheatmodeProgram = cheatmodeProgram.replace(/"[^"]+("|$)/gi,"");
	
	// If there is a push command not followed by an argument
	if (cheatmodeProgram.match(/#(?!(x[0-9a-f]+|[0-9]+))/gi))
	{
		throw "PUSH command without argument";
	}
	
	// Take only the valid Cheat Mode commands
	var cheatmodeArr = cheatmodeProgram.match(/#(x[0-9a-f]+|[0-9]+)|_?\[|[\]=?;+\-*/%!$&><\\)(}{,.:@]/gi);
	if (!cheatmodeArr) cheatmodeArr = [];
	
	// Initialize the list of commands
	var commandList = [];
	var regexMatch;
	
	// Process each of the commands
	for (var i = 0; i < cheatmodeArr.length; i++)
	{
		var command = cheatmodeArr[i];
		// If the command is a push command...
		regexMatch = command.match(pushCommand);
		if (regexMatch)
		{
			// Get the argument as a string
			var arg0 = regexMatch[1];
			// If it starts with x...
			if ((/^x/i).test(arg0))
			{
				// It's hex
				arg0 = BigInt("0x" + arg0.substring(1));
			}
			// Otherwise, if it's only numbers...
			else
			{
				// It's decimal
				arg0 = BigInt(arg0);
			}
			commandList.push({
				cmd: `#`,
				argv: [arg0]
			});
		}
		else
		{
			// Every other command is normal
			commandList.push({
				cmd: command,
				argv: []
			});
		}
	}
	
	// Check for balanced-ness of loops
	var nestDepth = 0;
	for (var i = 0; i < commandList.length; i++)
	{
		var command = commandList[i];
		if (["[", "_["].includes(command.cmd))
		{
			nestDepth++;
		}
		else if (["]"].includes(command.cmd))
		{
			nestDepth--;
		}
		// If there are too many loop end commands...
		if (nestDepth < 0)
		{
			throw "Unbalanced loops";
		}
	}
	
	// If there are too many loop start commands...
	if (nestDepth != 0)
	{
		throw "Unbalanced loops";
	}
	
	return commandList;
}

// Set output to string
function setOutput(str) {
	get("program-output").textContent = str;
}

// Add string to output element
function addToOutput(str) {
	get("program-output").textContent += str;
}

// Set error indicator to string
function setError(str) {
	get("program-error").textContent = str;
}

// Set done indicator to string
function setDone(str) {
	get("program-done").textContent = str;
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