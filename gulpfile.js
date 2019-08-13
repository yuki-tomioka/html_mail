/**
 * ------------------------------------------------------------
 * 読み込み
 * ------------------------------------------------------------
 */
const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineCss = require('gulp-inline-css');
const browserSync = require('browser-sync').create();

const src = './src';
const dist = './dist';

/**
 * ------------------------------------------------------------
 * 設定
 * ------------------------------------------------------------
 */
const sassOption = {
  outputStyle: 'expanded'
}

const inlineCssOption = {
  applyStyleTags: false,
  removeStyleTags: false,
  applyTableAttributes: true,
  // classやidを取るか、開発時は使用しない方が楽
  removeHtmlSelectors: true
};

const browserSyncOption = {
  server: './dist'
};


/**
 * ------------------------------------------------------------
 * タスク
 * ------------------------------------------------------------
 */
gulp.task('sass', () => {
  return gulp
    .src(src + '/sass/**/*.scss')
    .pipe(sass(sassOption))
    .pipe(gulp.dest(src + '/css/'));
});

gulp.task('inlineCss', () => {
  return gulp
    .src(src + '/**/*.html')
    .pipe(inlineCss(inlineCssOption))
    .pipe(gulp.dest(dist))
});

gulp.task('serve', (done) => {
  browserSync.init(browserSyncOption);
  done();
});

/**
 * ------------------------------------------------------------
 * watchタスク
 * ------------------------------------------------------------
 */
gulp.task('watch', (done) => {
  const browserReload = (done) => {
    browserSync.reload();
    done();
  };
  gulp.watch(src + '/**/*.scss', gulp.series('sass', 'inlineCss'));
  gulp.watch(src + '/**/*.html', gulp.task('inlineCss'));
  gulp.watch(dist + '/*', browserReload);
});


gulp.task('default', gulp.series('serve', 'watch'));
