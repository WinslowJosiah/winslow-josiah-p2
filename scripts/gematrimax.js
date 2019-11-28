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
			stateString = URLToTIOState(stateString);
			// If the cheatmode button's class is invalid...
			if (!["good","bad"].includes(stateString[2])) {
				// Throw an error
				throw "error";
			}
			// Set the values that were decoded
			programEl.value = byteStringToText(stateString[0]);
			autosize.update(programEl);
			inputEl.value = byteStringToText(stateString[1]);
			autosize.update(inputEl);
			cheatmodeButton.className = byteStringToText(stateString[2]);
		}
	}
	catch (err){
		// Give an error if we could not decode the share data
		console.error("The share data in the URL is malformed, or otherwise undecodable. Be sure it has been copied exactly into the address bar.");
	}
	
	// Click handler for clicking on the "Share" button
	shareButton.onclick = function(e) {
		tioState = [textToByteString(programEl.value), textToByteString(inputEl.value), textToByteString(cheatmodeButton.className)];
		// If the program textarea is not empty...
		if (tioState[0].length > 0)
		{
			// Encode the string and place it in the address bar
			history.pushState({}, "", "?" + TIOStateToURL(tioState));
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
				if (!execute || !execute())
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
		commands: cmdList,
		instructionPointer: 0,
		stack: [],
		addressStack: [],
		// Best way to get the codepoints!
		inputCodepoints: [...(get("program-input").value)],
		inputPointer: 0,
		eofReached: [...(get("program-input").value)].length == 0,
		programExecuting: true
	};
	
	return function() {
		for (var i = 0; i < 250; i++)
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
			
			// If the program has stopped, we're not still going!
			if (!executionState.programExecuting) return false;
		}
		// We're still going, don't stop me now!
		return true;
	};
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
	var pushCommand = /#(x[1-9a-f][0-9a-f]*|[1-9][0-9]*)/i;
	
	// Strip all comments (strings surrounded by quotes)
	cheatmodeProgram = cheatmodeProgram.replace(/"[^"]+("|$)/gi,"");
	
	// If there is a push command argument starting with 0
	if (cheatmodeProgram.match(/#(?=x?0)/gi))
	{
		setError("ERROR: Cannot push 0");
		return;
	}
	
	// If there is a push command not followed by an argument
	if (cheatmodeProgram.match(/#(?!x[1-9a-f][0-9a-f]*|[1-9][0-9]*)/gi))
	{
		setError("ERROR: Push command without argument");
		return;
	}
	
	// Take only the valid Cheat Mode commands
	var cheatmodeArr = cheatmodeProgram.match(/#(x[1-9a-f][0-9a-f]*|[1-9][0-9]*)|_?\[|[\]=?;+\-*/%!$&><\\)(}{,.:@]/gi);
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
			setError("ERROR: Unbalanced loops");
		}
	}
	
	// If there are too many loop start commands...
	if (nestDepth != 0)
	{
		setError("ERROR: Unbalanced loops");
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