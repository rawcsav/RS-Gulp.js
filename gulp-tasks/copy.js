const gulp = require("gulp");
const newer = require("gulp-newer");
const del = require("del");
const tap = require("gulp-tap");
const browserSync = require("browser-sync").create();

gulp.task("copy-static-dev", function () {
  return gulp
    .src(["src/static/**/*", "!src/static/css/*.css", "!src/static/js/*.js"])
    .pipe(newer("docs/static"))
    .pipe(gulp.dest("docs/static"))
    .pipe(browserSync.stream());
});

gulp.task("copy-base-dev", function () {
  return gulp
    .src(["src/*", "!src/*.html", "!src/**/*/"])
    .pipe(newer("docs"))
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.stream());
});

gulp.task("copy-static", function () {
  return gulp
    .src(["src/static/**/*", "!src/static/css/*.css", "!src/static/js/*.js"])
    .pipe(gulp.dest("docs/static"));
});

gulp.task("copy-base", function () {
  return gulp
    .src(["src/*", "!src/*.html", "!src/**/*/", "!src/partials"])
    .pipe(gulp.dest("docs"))
    .pipe(
      tap(function () {
        del("docs/partials");
      }),
    );
});

