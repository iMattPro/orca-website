/*****************************
 * CUE TRACKER VERSION CHECK
 * Version 5
 *
 * Written by Matt Friedman
 * 06/10/2020
 *****************************/
(function() {
	let version = GetURLParameter('version');

	$.getJSON("changelog.json", function(data) {
		let items = [];
		$.each(data.revision, function(key, revision) {
			if (versionCompare(version, revision.version) < 0) {
				let changes = '<li class="version"><h2>' + revision.version + (revision.date.length ? ' <span class="date">[ ' + revision.date + ' ]</span>' : '') + '</h2></li>';
				changes = changes + makeList(revision.log.new, 'New');
				changes = changes + makeList(revision.log.change, 'Change');
				changes = changes + makeList(revision.log.fix, 'Fix');
				items.push(changes);
			}
		});
		if (items.length) {
			$("#changes").html(items.join(""));
			$("#changelist").show();
			$("#download").attr("href", data.revision[0].link);
			$(".new-version").text(data.revision[0].version);
			if (version) {
				$("#current-version").show();
				$("#version").text(version);
			}
		} else {
			$("#up-to-date").show();
		}
	});

	/**
	 * Format changelog data into list elements
	 *
	 * @param {object} input An array object of changelog data
	 * @param {string} type The changelog format (new|fix|change)
	 */
	function makeList(input, type) {
		let output = '';
		if (input !== undefined) {
			for (let i = 0; i < input.length; i++) {
				output = output + '<li> <span class="badge badge-' + type.toLowerCase() + '">' + type + '</span> ' + input[i] + '</li>';
			}
		}
		return output;
	}

	/**
	 * Get a specified URL parameter's value
	 *
	 * @param {string} sParam The URL parameter to check
	 * @return {string|boolean} Parameter's value or false
	 */
	function GetURLParameter(sParam) {
		let sPageURL = window.location.search.substring(1);
		let sURLVariables = sPageURL.split('&');
		for (let i = 0; i < sURLVariables.length; i++) {
			let sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam) {
				return sParameterName[1];
			}
		}
		return false;
	}

	/**
	 * Compares two software version numbers (e.g. "1.7.1" or "1.2b").
	 *
	 * This function was born in http://stackoverflow.com/a/6832721.
	 *
	 * @param {string} v1 The first version to be compared.
	 * @param {string} v2 The second version to be compared.
	 * @param {object} [options] Optional flags that affect comparison behavior:
	 * lexicographical: (true/[false]) compares each part of the version strings lexicographically instead of naturally;
	 *                  this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than "1.2".
	 * zeroExtend: ([true]/false) changes the result if one version string has less parts than the other. In
	 *             this case the shorter string will be padded with "zero" parts instead of being considered smaller.
	 *
	 * @returns {number|NaN}
	 * - 0 if the versions are equal
	 * - a negative integer iff v1 < v2
	 * - a positive integer iff v1 > v2
	 * - NaN if either version string is in the wrong format
	 */
	function versionCompare(v1, v2, options) {
		let lexicographical = (options && options.lexicographical) || false,
			zeroExtend = (options && options.zeroExtend) || true,
			v1parts = (v1 || "0").split('.'),
			v2parts = (v2 || "0").split('.');

		function isValidPart(x) {
			return (lexicographical ? /^\d+[A-Za-zαß]*$/ : /^\d+[A-Za-zαß]?$/).test(x);
		}

		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}
		if (zeroExtend) {
			while (v1parts.length < v2parts.length) v1parts.push("0");
			while (v2parts.length < v1parts.length) v2parts.push("0");
		}
		if (!lexicographical) {
			v1parts = v1parts.map(function(x) {
				let match = (/[A-Za-zαß]/).exec(x);
				return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)) : x);
			});
			v2parts = v2parts.map(function(x) {
				let match = (/[A-Za-zαß]/).exec(x);
				return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)) : x);
			});
		}
		for (let i = 0; i < v1parts.length; ++i) {
			if (v2parts.length === i) {
				return 1;
			}
			if (v1parts[i] === v2parts[i]) {
				continue;
			} else if (v1parts[i] > v2parts[i]) {
				return 1;
			} else {
				return -1;
			}
		}
		if (v1parts.length !== v2parts.length) {
			return -1;
		}
		return 0;
	}
})();
