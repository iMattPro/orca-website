/*****************************
 * CUE TRACKER VERSION CHECK
 * Version 5
 *
 * Written by Matt Friedman
 * 06/10/2020
 *****************************/
(function() {
	let uVersion = GetURLParameter('version');

	$.getJSON("changelog.json", function(data) {
		let changes = [];
		const {revision} = data;
		const [{version: releaseVersion, link: releaseLink}] = revision;
		$.each(revision, function(key, {version, date, log}) {
			if (versionCompare(uVersion, version) < 0) {
				let list = `<li class="version"><h2>${version} <span class="date">[ ${date} ]</span></h2></li>`;
				for (let [key, value] of Object.entries(log)) {
					list += makeList(value, key);
				}
				changes.push(list);
			}
		});
		if (changes.length) {
			$("#changelist").show();
			$("#changes").html(changes.join(""));
			$("#download").attr("href", releaseLink);
			$(".new-version").text(releaseVersion);
			if (uVersion) {
				$("#current-version").show();
				$("#version").text(uVersion);
			}
		} else {
			$("#up-to-date").show();
		}
	});

	/**
	 * Format changelog data into list elements
	 *
	 * @param {array} changes An array of changelog data
	 * @param {string} index The changelog format (new|fix|change)
	 * @return {string}
	 */
	function makeList(changes, index) {
		return (changes !== undefined) ?
			changes.reduce((output, change) => {
				return output + `<li><span class="badge badge-${index}">${titleCase(index)}</span> ${change}</li>`;
			}, '') : ''
		;
	}

	/**
	 * Convert string to Title Case
	 *
	 * @param {string} str
	 * @return {string}
	 */
	function titleCase(str) {
		return str.replace(/\b\w/g, function(t) {
			return t.toUpperCase()
		});
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
	function versionCompare(v1, v2, options = {}) {
		const {lexicographical = false, zeroExtend = true} = options;
		let v1parts = (v1 || "0").split('.'),
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
