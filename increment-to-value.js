;(function() {
	"use strict";

	// Gets a running time that is at least one millisecond long
	function getValidRunningTime(target) {
		var runningTime = parseInt(target.getAttribute("data-run-time"));
		return runningTime > 0 ? runningTime : 1
	}

	// Gets a valid int (0 if not int found) value for the given attribute
	function getValidInt(target, attribute) {
		var value = parseInt(target.getAttribute(attribute));
		if (isNaN(value)) {
			return 0;
		}
		else {
			return value;
		}
	}

	// Initialises all the meta information required for each counter
	function initMeta(targets) {
		var meta = [],
			startTime = +(new Date());
		for (var i = 0; i < targets.length; i++) {
			var finalValueStr = targets[i].getAttribute('data-final-value'),
				startValueTemp = getValidInt(targets[i], 'data-start-value'),
				startTimeTemp = getValidInt(targets[i], 'data-start-delay'),
				finalValueTemp = parseInt(finalValueStr);
			var metaObj = {
				startValue: startValueTemp,
				finalValueStrLength: finalValueStr.length,
				finalValue: finalValueTemp,
				runningTime: getValidRunningTime(targets[i]),
				reverse: startValueTemp > finalValueTemp,
				range: startValueTemp - finalValueTemp,
				completed: false,
				target: targets[i],
				startTime: startTime + startTimeTemp
			}
			meta.push(metaObj);
			targets[i].childNodes[0].textContent = metaObj.startValue;
		}
		return meta;
	}

	var frameTime = 19, // Number of milliseconds to wait for the next frame
		targets = document.querySelectorAll('.increment-to-value'),
		targetsMeta = initMeta(targets),
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


	// Run a timer until all counters are finished.
	var timerId = window.setInterval(function() {
		var finishedCount = 0;
		for (var i = targetsMeta.length - 1; i >= 0; i--) {
			var now = +(new Date());

			// Skip targets that have already reached their final value or that should not yet start counting
			if (targetsMeta[i].completed || now <= targetsMeta[i].startTime) {
				continue;
			}

			// The new value for the counter is the % of the way through the running time (now - startTime / runningTime) multiplied by the final value
			var percentage = (now - targetsMeta[i].startTime) / targetsMeta[i].runningTime,
				newValue = parseInt(targetsMeta[i].startValue - (percentage * targetsMeta[i].range));

			// Check if we've reached the final value on this frame
			if ((targetsMeta[i].reverse && newValue <= targetsMeta[i].finalValue) || (!targetsMeta[i].reverse && newValue >= targetsMeta[i].finalValue)) {

				// And finalise it if so
				newValue = targetsMeta[i].finalValue;
				targetsMeta[i].completed = true;
				++finishedCount;
			}

			// Update the text to reflect the current increment
			if (targetsMeta[i].reverse) {
				targetsMeta[i].target.childNodes[0].textContent = newValue.toLocaleString();
			}
			else {
				var newText = parseInt("1" + pads[targetsMeta[i].finalValueStrLength - (newValue + "").length] + newValue).toLocaleString();
				targetsMeta[i].target.childNodes[0].textContent = newText.indexOf(",") === 1 ? newText.substring(2) : newText.substring(1);
			}
		}

		// Stop running the interval timer if all counters have finished incrementing.
		if (finishedCount === targetsMeta.length) {
			window.clearInterval(timerId);
		}

	}, frameTime)
})();