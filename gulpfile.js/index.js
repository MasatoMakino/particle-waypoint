"use strict";

const { series } = require("gulp");

const doc = require("gulptask-tsdoc").generateTask();
const { tsc, tscClean, watchTsc } = require("gulptask-tsc").generateTasks({
  projects: ["tsconfig.cjs.json", "tsconfig.esm.json"],
});

const watchTasks = async () => {
  watchTsc();
};

exports.start_dev = watchTasks;
exports.build = series(tsc, doc);
exports.build_clean = series(tscClean, doc);
