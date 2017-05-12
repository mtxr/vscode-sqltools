const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')
const codacy = require('gulp-codacy')

gulp.task('codacy', function codacyTask () {
  return gulp
    .src(['./coverage/lcov.info'], { read: false })
    .pipe(codacy({
      token: process.env.CODACY_PROJECT_TOKEN
    }))
})

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

gulp.task('default', ['pre-run-vscode', 'watch'])

gulp.task('pre-coverage-vscode', ['compile'], () => {
  require('fs').writeFileSync(`${__dirname}/coverage.enabled`, 'true')
})

gulp.task('pre-run-vscode', ['compile'], () => {
  const fs = require('fs')
  if (fs.existsSync(`${__dirname}/coverage.enabled`)) fs.unlinkSync(`${__dirname}/coverage.enabled`)
})
