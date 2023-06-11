const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const include = require("gulp-include");

function pages() {
  return src("./app/pages/*.html")
    .pipe(
      include({
        includePaths: "./app/components",
      })
    )
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("./app/scss/style.scss")
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("./app/css"))
    .pipe(browserSync.stream());
}

function watcher() {
  watch(["./app/scss/style.scss"], styles);
  watch(["./app/components/*", "./app/pages/*"], pages);
  watch(["./app/*.html"]).on("change", browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./app",
    },
  });
}

function cleanDist() {
  return src("dist").pipe(clean());
}

function building() {
  return src(["./app/css/style.min.css", 
              "./app/index.html",
              "./app/img/**/*.*",
              "./app/fonts/**/*.*"
            ], 
              {
                base: "./app",
              })
        .pipe(dest("./dist"));
}

exports.pages = pages;
exports.styles = styles;
exports.watcher = watcher;
exports.browsersync = browsersync;
exports.cleanDist = cleanDist;
exports.building = building;

exports.default = parallel(styles, browsersync, pages, watcher);
exports.build = series(cleanDist, building);

