const gulp = require("gulp");
const del = require("del");

gulp.task("clean-partials", function () {
  return del(["docs/partials"]);
});

gulp.task("clean-js", function () {
  return del(["docs/history.js"]);
});

