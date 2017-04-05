;(function() {
	"use strict";

	var speed = 5000, // Default number of milliseconds to show the animation
		frameTime = 19, // Number of milliseconds to wait for the next frame
		frameIndex = 0, // The current frame index
		frames = speed / frameTime, // Default number of frames to run the animation
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
		],
		targets = document.querySelectorAll('.increment-to-value');

	// Set all counters to their initial values.
	for (var i=targets.length-1; i>=0; i--) {
		targets[i].childNodes[0].textContent = "0";
		targets[i].incrementToValue = {
			endCountStr: targets[i].getAttribute('data-final-value'),
			endCount: parseInt(targets[i].getAttribute('data-final-value')),
			frames: parseInt(parseInt(targets[i].getAttribute("data-run-time")) / frameTime),
			completed: false
		}
	}

	// Run a timer until all counters are finished.
	var timerId = window.setInterval(function() {
		var finishedCount = 0;
		for (var i = targets.length - 1; i >= 0; i--) {

			// Skip targets that have already reached their final value
			if (targets[i].completed) {
				continue;
			}

			var newValue = parseInt(targets[i].incrementToValue.endCount * frameIndex / targets[i].incrementToValue.frames);

			// Check if we've reached the final value on this frame
			if (newValue >= targets[i].incrementToValue.endCount) {
				newValue = targets[i].incrementToValue.endCount;
				targets[i].incrementToValue.completed = true;
				++finishedCount;
			}
			var newText = parseInt("1" + pads[targets[i].incrementToValue.endCountStr.length - (newValue + "").length] + newValue).toLocaleString();
			targets[i].childNodes[0].textContent = newText.indexOf(",") === 1 ? newText.substring(2) : newText.substring(1);
		}
		if (finishedCount === targets.length) {
			window.clearInterval(timerId);
		}

		++frameIndex;
	}, frameTime)
})();