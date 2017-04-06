;(function() {
	"use strict";

	// Gets a running time that is at least one millisecond long
	function getValidRunningTime(target) {
		var runningTime = parseInt(target.getAttribute("data-run-time"));
		return runningTime > 0 ? runningTime : 1
	}

	var frameTime = 19, // Number of milliseconds to wait for the next frame
		startTime = +(new Date()),
		targets = document.querySelectorAll('.increment-to-value'),
		pads = [
			'',
			'0',
			'00',
			'000',
			'0000',
			'00000',
			'000000',
			'0000000',
			'00000000',
			'000000000',
			'0000000000'
		];

	// Set all counters to their initial values.
	for (var i=targets.length-1; i>=0; i--) {
		targets[i].childNodes[0].textContent = "0";
		targets[i].incrementToValue = {
			finalValueStrLength: targets[i].getAttribute('data-final-value').length,
			finalValue: parseInt(targets[i].getAttribute('data-final-value')),
			runningTime: getValidRunningTime(targets[i]),
			completed: false
		}
	}

	// Run a timer until all counters are finished.
	var timerId = window.setInterval(function() {
		var finishedCount = 0;
		for (var i = targets.length - 1; i >= 0; i--) {

			// Skip targets that have already reached their final value
			if (targets[i].incrementToValue.completed) {
				continue;
			}

			// The new value for the counter is the % of the way through the running time (now - startTime / runningTime) multiplied by the final value
			var newValue = parseInt(targets[i].incrementToValue.finalValue * (+(new Date()) - startTime) / targets[i].incrementToValue.runningTime);

			// Check if we've reached the final value on this frame
			if (newValue >= targets[i].incrementToValue.finalValue) {

				// And finalise it if so
				newValue = targets[i].incrementToValue.finalValue;
				targets[i].incrementToValue.completed = true;
				++finishedCount;
			}

			// Update the text to reflect the current increment
			var newText = parseInt("1" + pads[targets[i].incrementToValue.finalValueStrLength - (newValue + "").length] + newValue).toLocaleString();
			targets[i].childNodes[0].textContent = newText.indexOf(",") === 1 ? newText.substring(2) : newText.substring(1);
		}
		if (finishedCount === targets.length) {
			window.clearInterval(timerId);
		}

	}, frameTime)
})();