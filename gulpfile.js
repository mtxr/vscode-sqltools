const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')
const uglifyify = require('uglifyify')
const uglifyjs = require('gulp-uglify')
const babelify = require('babelify')
const streamify = require('gulp-streamify')
const sass = require('gulp-sass')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const browserifyInc = require('browserify-incremental')

const dest = 'dist'

const dependencies = [ 'react', 'react-dom', 'prop-types' ]

function errorHandler (err) {
  console.error(err.stack || err)
  this.emit('end')
}

function buildReactFile (file) {
  const bundler = browserify(Object.assign({}, browserifyInc.args, {
    entries: `src/views/js/${file}.jsx`,
    transform: [
      babelify.configure({ presets: ['es2015', 'react'] }),
      [uglifyify]
    ]
  }))

  browserifyInc(bundler, { cacheFile: `cache/browserify-cache-${file}.json` })

  dependencies.forEach((dep) => {
    bundler.external(dep)
  })
  return bundler.bundle()
    .on('error', errorHandler)
    .pipe(source(`${file}.js`))
    .pipe(streamify(uglifyjs({ mangle: true, compress: true })))
    .pipe(gulp.dest(`${dest}/views/js`))
}

gulp.task('compile:vendor', () => {
  return browserify({
    require: dependencies,
    debug: true,
    transform: [
      [uglifyify]
    ]
  })
    .bundle()
    .on('error', errorHandler)
    .pipe(source('vendors.js'))
    .pipe(streamify(uglifyjs({ mangle: true, compress: true })))
    .pipe(gulp.dest(`${dest}/views/js`))
})

gulp.task('compile:copy', () => {
  let count = 0
  gulp.src([
    'package.json'
  ])
    .pipe(gulp.dest(dest))

  return gulp.src([
    './src/resources/**/*',
    './src/views/*.*',
    './src/views/css/*.*'
  ], { base: './src' })
    .pipe(gulp.dest(dest))
})

gulp.task('compile:ts', () => {
  return gulp.src([
    './src/*.ts',
    './src/**/*.ts',
  ])
  .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write('', { includeContent: false, sourceRoot: '' }))
    .pipe(gulp.dest(dest))
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
gulp.task('compile:sass', () => {
  return gulp.src('./src/views/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${dest}/views/css`))
})

gulp.task('compile:react', () => {
  return buildReactFile('app')
})

gulp.task('compile', ['clean', 'compile:vendor', 'compile:sass', 'compile:ts', 'compile:copy', 'compile:react'])
gulp.task('watch', ['watch:sass', 'watch:ts', 'watch:copy', 'watch:react'])

gulp.task('default', ['compile', 'watch'])
