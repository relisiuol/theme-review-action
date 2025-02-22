/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');

const READ_OPTIONS = { encoding: 'utf8' };
const ROOT_PATH = path.join(__dirname, '../../');
const ROOT_PATH_THEME = `${ROOT_PATH}/test-theme`;

const isChildTheme = () => {
	return process.env.WP_THEME_TYPE === 'child';
};

const isBlockTheme = () => {
	return process.env.WP_THEME_TYPE === 'block';
};

/**
 * Adds messaging to log
 * @param {array} lines
 */
const appendToLog = (input) => {
	const path = `${ROOT_PATH}/logs/structure-check-errors.txt`;

	fs.appendFileSync(path, `${input}\n\n`, {
		encoding: 'utf8',
	});
};

/**
 * Return false if the file doesn't exist or can't be read
 * @param {string} filePath
 */
const fileExists = (filePath) => {
	try {
		fs.readFileSync(filePath, READ_OPTIONS);
		return true;
	} catch (e) {
		if (e.code.toLowerCase() !== 'enoent') {
			console.log(e);
		}
	}

	return false;
};

(() => {
	console.log('Running structure check.');
	let hasErrors = false;

	// Child Themes don't require an index.php
	if (
		!isChildTheme() &&
		!isBlockTheme() &&
		!fileExists(`${ROOT_PATH_THEME}/index.php`)
	) {
		appendToLog('The theme is required to have an index.php file.');
		hasErrors = true;
	}

	// Block themes require theme.json
	if (
		isBlockTheme() &&
		!fileExists(`${ROOT_PATH_THEME}/theme.json`)
	) {
		appendToLog(
			'Block themes are quired to have a theme.json file.'
		);
		hasErrors = true;
	}

	if (!fileExists(`${ROOT_PATH_THEME}/style.css`)) {
		appendToLog('The theme is required to have a style.css file.');
		hasErrors = true;
	}

	if (
		!fileExists(`${ROOT_PATH_THEME}/screenshot.png`) &&
		!fileExists(`${ROOT_PATH_THEME}/screenshot.jpg`) &&
		!fileExists(`${ROOT_PATH_THEME}/screenshot.jpeg`)
	) {
		appendToLog(
			'The theme is required to have a screenshot.png or screenshot.jpg file.'
		);
		hasErrors = true;
	}

	if (hasErrors) {
		throw Error('Failed basic structure.');
	}

	console.log('Complete structure check.');
})();
