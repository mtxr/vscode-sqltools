const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')

gulp.task('compile', () => {
  const dest = './out'
  gulp.src('./package.json').pipe(gulp.dest(dest))

  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return tsResult.js
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: (file) => { return file.cwd + '/src' }
    }))
    .pipe(gulp.dest(dest))
})

gulp.task('watch', () => {
  gulp.watch([
    './src/**/*.ts',
    './test/**/*.ts',
    './package.json'
  ], ['compile'])
})

gulp.task('default', ['compile', 'watch'])
