"use strict";

const { series } = require("gulp");

const doc = require("gulptask-tsdoc").get();
const { tsc, tscClean, watchTsc } = require("gulptask-tsc").get({
  projects: ["tsconfig.json", "tsconfig.esm.json"]
});

const watchTasks = async () => {
  watchTsc();
};

exports.start_dev = watchTasks;
exports.build = series(tsc, doc);
exports.build_clean = series(tscClean, doc);
