const gulp = require("gulp");
const cssmin = require("gulp-cssmin");
const newer = require("gulp-newer");
const browserSync = require("browser-sync").create();

gulp.task("css-dev", function () {
  return gulp
    .src("src/static/css/*.css")
    .pipe(newer("docs/static/css"))
    .pipe(cssmin())
    .pipe(gulp.dest("docs/static/css"))
    .pipe(browserSync.stream());
});

gulp.task("minify-css", function () {
  return gulp
    .src("src/static/css/*.css")
    .pipe(cssmin())
    .pipe(gulp.dest("docs/static/css"));
});

