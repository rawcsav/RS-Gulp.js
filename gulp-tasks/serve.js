const path = require("path");
const fs = require("fs");

// Gulp serve task configuration
const gulp = require("gulp");
const browserSync = require("browser-sync").create();

function removeTrailingSlash(req, res, next) {
  const projectRoot = path.resolve(__dirname, ".."); // Adjust to project root

  const urlWithoutSlash = req.url.replace(/\/$/, "");
  const filePath = path.join(projectRoot, "docs", `${urlWithoutSlash}.html`);

  if (fs.existsSync(filePath)) {
    req.url = `${urlWithoutSlash}.html`;
  }

  next();
}

gulp.task("serve", function (done) {
  browserSync.init({
    server: {
      baseDir: "docs",
      middleware: [removeTrailingSlash],
    },
  });

  gulp.watch(
    ["src/**/*.html", "!src/partials/**/*.html"],
    gulp.series("html-dev", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    "src/partials/**/*.html",
    gulp.series("html-dev-all", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    "src/static/css/*.css",
    gulp.series("css-dev", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    "src/static/js/*.js",
    gulp.series("js-dev", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    ["src/static/js/history.js", "src/static/js/visual.js"],
    gulp.series("concat-js", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    ["src/static/**/*", "!src/static/css/*.css", "!src/static/js/*.js"],
    gulp.series("copy-static-dev", function (done) {
      browserSync.reload();
      done();
    }),
  );
  gulp.watch(
    ["src/*", "!src/*.html", "!src/*/*/"],
    gulp.series("copy-base-dev", function (done) {
      browserSync.reload();
      done();
    }),
  );

  done();
});

