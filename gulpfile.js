const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')
const source = require('vinyl-source-stream')
const concat = require('gulp-concat')
const browserify = require('browserify')
const babelify = require('babelify')
const streamify = require('gulp-streamify')

const dest = 'dist'

gulp.task('compile:copy', () => {
  gulp.src([
    'package.json'
  ])
    .pipe(gulp.dest(dest))

  gulp.src([
    './src/resources/**/*',
    './src/views/*.*',
    './src/views/css/*.*'
  ], { base: './src' })
    .pipe(gulp.dest(dest))
})

gulp.task('compile:ts', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest))
})

gulp.task('compile:react:statistics', () => {
  return browserify({
    entries: ['src/views/js/statistics.jsx'],
    transform: [
      [ babelify, { presets: ['es2015', 'react'] } ]
    ]
  })
        .bundle()
        .pipe(source(`${dest}/views/js/statistics.js`))
        .pipe(streamify(concat('statistics.js')))
        .pipe(gulp.dest(`${dest}/views/js`))
})

gulp.task('watch:ts', () => {
  gulp.watch([
    'src/*.ts',
    'src/**/*.ts',
    'package.json'
  ], ['compile:ts'])
})

gulp.task('watch:copy', () => {
  gulp.watch([
    'package.json',
    'src/views/*.html',
    'src/views/css/*.css'
  ], ['compile:copy'])
})

gulp.task('watch:react', () => {
  gulp.watch([
    'package.json',
    'src/views/*.jsx',
    'src/views/**/*.jsx'
  ], ['compile:react'])
})

gulp.task('compile:react', ['compile:react:statistics'])

gulp.task('compile', ['compile:copy', 'compile:ts', 'compile:react'])
gulp.task('watch', ['watch:copy', 'watch:ts', 'watch:react'])

gulp.task('default', ['watch'])
