const gulp = require('gulp'),
      connect = require('gulp-connect'),
      chokidarEvEmitter = require('chokidar-socket-emitter')


const paths = {
  livereload: ['**/*.html']
}


gulp.task('server', function() {
  connect.server({
    root: 'public',
    livereload: true
  })
})


gulp.task('reload', function() {
  gulp.src(paths.livereload)
    .pipe(connect.reload())
})


gulp.task('watch', function() {
  chokidarEvEmitter({port: 5776, path: 'public/'})
  gulp.watch(paths.livereload, ['reload'])
})


gulp.task('default', ['server', 'watch'])
