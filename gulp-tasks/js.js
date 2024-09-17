const gulp = require("gulp");
const gulpTerser = require("gulp-terser");
const newer = require("gulp-newer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");

gulp.task("js-dev", function () {
  return gulp
    .src("src/static/js/*.js")
    .pipe(newer("docs/static/js"))
    .pipe(gulpTerser())
    .pipe(gulp.dest("docs/static/js"))
    .pipe(browserSync.stream());
});

gulp.task("concat-js", function () {
  return gulp
    .src(["src/static/js/history.js", "src/static/js/visual.js"])
    .pipe(concat("visual.js"))
    .pipe(gulpTerser())
    .pipe(gulp.dest("docs/static/js"));
});

gulp.task("minify-js", function () {
  return gulp
    .src("src/static/js/*.js")
    .pipe(gulpTerser())
    .pipe(gulp.dest("docs/static/js"));
});

