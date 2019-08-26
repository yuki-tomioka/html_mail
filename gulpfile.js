/**
 * ------------------------------------------------------------
 * 読み込み
 * ------------------------------------------------------------
 */
const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineCss = require('gulp-inline-css');
const browserSync = require('browser-sync').create();
const mail = require('gulp-mail');
const env = require('node-env-file');

const src = './src';
const dist = './dist';

env('.env');
const mailTo = process.env.mailTo;
const smtpUser = process.env.smtpUser;
const smtpPass = process.env.smtpPass;
const smtpHost = process.env.smtpHost;
const smtpPort = process.env.smtpPort;

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
  server: dist
};

const smtpInfo = {
  auth: {
    user: smtpUser,
    pass: smtpPass
  },
  host: smtpHost,
  secureConnection: true,
  port: smtpPort
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

gulp.task('mail', () => {
  return gulp
    .src(dist + '/index.html')
    .pipe(mail({
      subject: 'html mail test',
      to: [
        mailTo
      ],
      from: smtpUser,
      smtp: smtpInfo
    }));
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
