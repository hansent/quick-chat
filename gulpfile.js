var gulp = require('gulp');
var browserify = require('browserify');
var envify = require('envify/custom');
var partialify = require('partialify');
var source = require('vinyl-source-stream');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');


// default task /////////////////////////////////////////////////
gulp.task('default', ['build', 'connect', 'watch']);


// build tasks //////////////////////////////////////////////////
gulp.task('build', ['browserify']);

gulp.task('browserify', function() {
  var environ = {
    NODE_ENV: process.env.NODE_ENV
  };
  return browserify('./public/main.js')
  .transform(envify(environ))
  .transform(partialify)
  .bundle({
    debug: process.env.NODE_ENV === 'development'
  })
  .on('error', handleErrors)
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('public/'));
});



// livereload dev server ///////////////////////////////////////
gulp.task('connect', function() {
  // simple static http server based on connect
  // automatically injects livereload script
  connect.server({
    root: 'public',
    port: process.env.PORT || 5000,
    livereload: true
  });
});

gulp.task('watch', ['build'], function() {
  // rebuild on src changes
  gulp.watch('src/**/*', ['build']);
  // -> files in dist change
  // -> triggers reload task
  // -> sends reload msg to browser
  gulp.watch('public/**/*', ['reload']);
});

gulp.task('reload', function() {
  // trigger a browser reload
  gulp.src('./src/index.html')
    .pipe(connect.reload());
});


// error handler ///////////////////////////////////////////////
function handleErrors() {
  // Send error to notification center with gulp-notify
  notify.onError({
      title: "Compile Error",
      message: "<%= error %>"
    })
    .apply(this, arguments);
  // Keep gulp from hanging on this task
  this.emit('end');
}
