/*
 * CUE TRACKER VERSION CHECK
 *
 * (c) 2020 Matt Friedman
 */
(function(document, window) {
	let uVersion = GetURLParameter("version");

	fetch("changelog.json").then(function (response) {
		// The API call was successful!
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(response);
		}
	}).then(function (data) {
		// This is the JSON from our response
		let changes = [];
		const {revision} = data;
		const [{version: releaseVersion, link: releaseLink}] = revision;
		revision.forEach(function({version, date, log}) {
			if (versionCompare(uVersion, version) < 0) {
				let list = `<li><h2>${version} <span class="date">[ ${date} ]</span></h2></li>`;
				for (let [key, value] of Object.entries(log)) {
					list += makeList(value, key);
				}
				changes.push(list);
			}
		});
		if (changes.length) {
			show("#changelist");
			setHtml("#changes", changes.join(""));
			setAttr("#download", "href", releaseLink);
			setText(".new-version", releaseVersion);
			if (uVersion) {
				show("#current-version");
				setText("#version", uVersion);
			}
		} else {
			show("#up-to-date");
		}
	}).catch(function (err) {
		// There was an error
		console.warn("Something went wrong.", err);
	});

	/**
	 * Display DOM elements
	 *
	 * @param {string} elem DOM element
	 */
	function show(elem) {
		document.querySelectorAll(elem).forEach(el => {
			el.style.display = "block"
		});
	}

	/**
	 * Set text on DOM elements
	 *
	 * @param {string} elem DOM element
	 * @param {string} text Text to use
	 */
	function setText(elem, text) {
		document.querySelectorAll(elem).forEach(el => {
			el.textContent = text
		});
	}

	/**
	 * Set HTML on DOM elements
	 *
	 * @param {string} elem DOM element
	 * @param {string} html HTML to use
	 */
	function setHtml(elem, html) {
		document.querySelectorAll(elem).forEach(el => {
			el.innerHTML = html
		});
	}

	/**
	 * Set the attribute of DOM elements
	 *
	 * @param {string} elem DOM element
	 * @param {string} attr The attribute to set
	 * @param {string} value The value to use
	 */
	function setAttr(elem, attr, value) {
		document.querySelectorAll(elem).forEach(el => {
			el.setAttribute(attr, value)
		});
	}

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
				return output + `<li><span class="badge badge-${index}">${index}</span> ${change}</li>`;
			}, "") : ""
		;
	}

	/**
	 * Get a specified URL parameter's value
	 *
	 * @param {string} sParam The URL parameter to check
	 * @return {string|boolean} Parameter's value or false
	 */
	function GetURLParameter(sParam) {
		const sPageURL = window.location.search.substring(1);
		const sURLVariables = sPageURL.split("&");
		for (let sURLVariable of sURLVariables) {
			let [param, value] = sURLVariable.split("=");
			if (param === sParam) {
				return value;
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
})(document, window);
