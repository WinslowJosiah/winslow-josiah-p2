// Helper functions

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