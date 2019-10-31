var gulp = require("gulp");
//var less = require("gulp-less");
var sass = require('gulp-sass');
var browserSync = require("browser-sync").create();

//добавляю новое
var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var stylelint   = require('stylelint');
var syntax_scss = require('postcss-scss');
//добавила

const compileSass = () =>
  gulp
    //.src("app/less/main.less")
    .src('app/sass/main.scss')
    //.pipe(less())
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );

const watchHtml = () =>
  gulp.src("app/**/*.html").pipe(
    browserSync.reload({
      stream: true
    })
  );

const init = () => {
  // Server initialization
  browserSync.init({
    server: {
      baseDir: "./app"
    },
    notify: false
  });

  // Watches changes in HTML files and refreshes
  // them with BrowserSync if something was changed
  gulp.watch("app/**/*.html", watchHtml);

  // Watches Less => compiles Less to CSS => Refreshes changes in browser
  //gulp.watch("app/less/**/*.less", compileLess);

  gulp.watch("app/sass/**/*.scss", compileSass);
};

// Default(initital) task for Gulp
exports.default = gulp.series(compileSass, init);

gulp.task("scss-lint", function() {

  // Stylelint config rules
  var stylelintConfig = {
    "rules": {
      "block-no-empty": true,
      "color-no-invalid-hex": true,
      "declaration-colon-space-after": "always",
      "declaration-colon-space-before": "never",
      "function-comma-space-after": "always",
      "function-url-quotes": "double",
      "media-feature-colon-space-after": "always",
      "media-feature-colon-space-before": "never",
      "media-feature-name-no-vendor-prefix": true,
      "max-empty-lines": 5,
      "number-leading-zero": "never",
      "number-no-trailing-zeros": true,
      "property-no-vendor-prefix": true,
      "rule-no-duplicate-properties": true,
      "declaration-block-no-single-line": true,
      "rule-trailing-semicolon": "always",
      "selector-list-comma-space-before": "never",
      "selector-list-comma-newline-after": "always",
      "selector-no-id": true,
      "string-quotes": "double",
      "value-no-vendor-prefix": true
    }
  }

  var processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true
    })
  ];

  return gulp.src(
      ['app/assets/css/**/*.scss',
      // Ignore linting vendor assets
      // Useful if you have bower components
      '!app/assets/css/vendor/**/*.scss']
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
});