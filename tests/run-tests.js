const path = require("node:path");
const tests = ["api-client.test.js", "session.test.js"];

(async () => {
	for (const test of tests) {
		const module = require(path.resolve(__dirname, test));
		if (typeof module === "function") {
			await module();
		} else if (module?.then) {
			await module;
		}
	}

	console.log("All smoke tests passed.");
})();
