const gulp = require("gulp");
const requireDir = require("require-dir");

requireDir("./gulp-tasks");

gulp.task("dev", gulp.series("serve"));

gulp.task(
  "build",
  gulp.series(
    "fetch-commit-info",
    "update-html-partial",
    "html",
    "minify-css",
    "minify-js",
    "concat-js",
    "copy-static",
    "copy-base",
    "clean-partials",
    function (done) {
      console.log("All build tasks completed");
      done();
    },
  ),
);

gulp.on("error", function (err) {
  console.log("Gulp error:", err.toString());
  console.log("Error details:", err);
  this.emit("end");
});

gulp.task("default", gulp.series("build"));

