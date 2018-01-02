const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')
const concat = require('gulp-concat')
const uglifyify = require('uglifyify')
const uglifyjs = require('gulp-uglify')
const bro = require('gulp-bro')
const babelify = require('babelify')
const streamify = require('gulp-streamify')
const sass = require('gulp-sass')

const dest = 'dist'

function buildReactFile (file) {
  return gulp.src([`src/views/js/${file}.jsx`])
    .pipe(bro({
      transform: [
        [babelify, { presets: ['es2015', 'react'] }],
        [uglifyify]
      ]
    }))
    .pipe(streamify(concat(`${file}.js`)))
    .pipe(streamify(uglifyjs({ mangle: true, compress: true })))
    .pipe(gulp.dest(`${dest}/views/js`))
}

gulp.task('compile:copy', (done) => {
  let count = 0
  gulp.src([
    'package.json'
  ])
    .pipe(gulp.dest(dest))
    .on('finish', () => {
      if (count === 1) return done()
      count++
    })

  gulp.src([
    './src/resources/**/*',
    './src/views/*.*',
    './src/views/css/*.*'
  ], { base: './src' })
    .pipe(gulp.dest(dest))
    .on('finish', () => {
      if (count === 1) return done()
      count++
    })
})

gulp.task('compile:ts', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return tsResult.js
    .pipe(sourcemaps.write('', { includeContent: false, sourceRoot: '' }))
    .pipe(gulp.dest(dest))
})

gulp.task('compile:react:statistics', () => {
  return buildReactFile('statistics')
})

gulp.task('compile:react:query-results', () => {
  return buildReactFile('query-results')
})

gulp.task('compile:sass:statistics', () => {
  return gulp.src('./src/views/sass/statistics.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${dest}/views/css`))
})

gulp.task('compile:sass:query-results', () => {
  return gulp.src('./src/views/sass/query-results.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${dest}/views/css`))
})

gulp.task('watch:ts', () => {
  return gulp.watch([
    './src/*.ts',
    './src/**/*.ts',
    './package.json'
  ], ['compile:ts'])
})

gulp.task('watch:copy', () => {
  return gulp.watch([
    './package.json',
    './src/views/*.html',
    './src/views/css/*.css'
  ], ['compile:copy'])
})

gulp.task('watch:react', () => {
  return gulp.watch([
    './package.json',
    './src/views/*.jsx',
    './src/views/**/*.jsx'
  ], ['compile:react'])
})

gulp.task('watch:sass', () => {
  return gulp.watch([
    './src/views/sass/*.scss',
    './src/views/sass/**/*.scss'
  ], ['compile:sass'])
})

gulp.task('clean', (done) => {
  const fs = require('fs')

  const deleteFolderRecursive = function (path, cb = () => {}) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file, index) {
        var curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
      return cb()
    }
    cb()
  }
  deleteFolderRecursive(`${__dirname}/dist`, done)
})

gulp.task('compile:react', ['compile:react:query-results', 'compile:react:statistics'])
gulp.task('compile:sass', ['compile:sass:query-results', 'compile:sass:statistics'])

gulp.task('compile', ['compile:sass', 'compile:ts', 'compile:copy', 'compile:react'])
gulp.task('watch', ['watch:sass', 'watch:ts', 'watch:copy', 'watch:react'])

gulp.task('default', ['compile', 'watch'])
