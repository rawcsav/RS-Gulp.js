const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const tap = require("gulp-tap");
const path = require("path");
const plumber = require("gulp-plumber");
const newer = require("gulp-newer");
const browserSync = require("browser-sync").create();
const fs = require("fs");

const { exec } = require("child_process");

gulp.task("fetch-commit-info", (done) => {
  exec(
    'git log -1 --pretty=format:\'{ "hash": "%H", "message": "%s", "date": "%cd" }\' --date=iso',
    { stdio: "ignore" },
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error fetching commit info:", stderr);
        done(err);
        return;
      }
      global.commitInfo = stdout;
      done();
    },
  );
});

gulp.task("update-html-partial", (done) => {
  const htmlPartialPath = path.join(
    __dirname,
    "../src/partials/commit-history.html",
  );

  if (!global.commitInfo) {
    console.error("Commit info not available.");
    done(new Error("Commit info not available."));
    return;
  }

  let commitInfo;
  try {
    commitInfo = JSON.parse(global.commitInfo);
  } catch (parseErr) {
    console.error("Error parsing commit info:", global.commitInfo);
    done(parseErr);
    return;
  }

  const { message: commitMessage, date: commitDate } = commitInfo;

  const htmlContent = `
    <div class="commit-info">
      <span>Site Last Updated:</span> <p>${commitDate}</p>
      <span>Commit Message: </span><p>${commitMessage}</p>
    </div>
  `;

  fs.writeFile(htmlPartialPath, htmlContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing HTML partial file:", err);
      done(err);
      return;
    }

    console.log("HTML partial file updated successfully.");
    done();
  });
});

function processHTML(file) {
  const depth = file.path.replace(file.base, "").split(path.sep).length - 1;
  const prefix = "../".repeat(Math.max(0, depth - 1));
  if (depth > 1) {
    file.contents = Buffer.from(
      file.contents
        .toString()
        .replace(/(src|href)="((?!http|https|\/|#).+?)"/g, (match, p1, p2) => {
          if (!p2.startsWith("../")) {
            return `${p1}="${prefix}${p2}"`;
          }
          return match;
        }),
    );
  }
}

gulp.task("html-dev", function () {
  return gulp
    .src(["src/**/*.html", "!src/partials/**/*.html"])
    .pipe(plumber())
    .pipe(newer("docs"))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(tap(processHTML))
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.stream());
});

gulp.task("html-dev-all", function () {
  return gulp
    .src("src/**/*.html")
    .pipe(plumber())
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(tap(processHTML))
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.stream());
});

gulp.task("html", function () {
  return gulp
    .src(["src/**/*.html", "!src/partials/**/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(tap(processHTML))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("docs"));
});

