const fs = require('fs')
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
const { series, parallel } = gulp

const dest = 'dist'
const dependencies = [ 'react', 'react-dom', 'prop-types' ]

const cfg = {
  ts: {
    src: ['src/*.ts', 'src/**/*.ts']
  },
  sass: {
    src: ['src/views/sass/*.scss', 'src/views/sass/**/*.scss']
  },
  react: {
    src: ['src/views/*.jsx','src/views/**/*.jsx']
  },
  copy: {
    static: ['package.json'],
    src: ['src/resources/**/*','src/views/*.*','src/views/css/*.*']
  }
}

function errorHandler (err) {
  console.error(err.stack || err)
  this.emit('end')
}

const _deleteFolderRecursive = function (path, cb = () => { }) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        _deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
    return cb()
  }
  cb()
}

function _buildReactFile (file) {
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

function clean(done) {
  return _deleteFolderRecursive(`${__dirname}/dist`, done)
}

function compileSass() {
  return gulp.src(cfg.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${dest}/views/css`))
}

function compileJs() {
  return gulp.src(cfg.ts.src)
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write('', { includeContent: false, sourceRoot: '' }))
    .pipe(gulp.dest(dest))
}

function compileVendor() {
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
}

function copy() {
    let count = 0
    gulp.src(cfg.copy.static)
      .pipe(gulp.dest(dest))

    return gulp.src(cfg.copy.src, { base: 'src' })
      .pipe(gulp.dest(dest))
}

// tasks
gulp.task('clean', clean)
gulp.task('compile:sass', compileSass)
gulp.task('compile:ts', compileJs)
gulp.task('compile:vendor', compileVendor)
gulp.task('compile:react', compileReact = () => _buildReactFile('app'))
gulp.task('compile:copy', copy)

// watchers
gulp.task('watch:sass', watchSass = () => gulp.watch(cfg.sass.src, parallel('compile:sass')))
gulp.task('watch:ts', watchTs = () => gulp.watch(cfg.ts.src, parallel('compile:ts')))
gulp.task('watch:react', watchReact = () => gulp.watch(cfg.react.src, parallel('compile:react')))
gulp.task('watch:copy', watchStatic = () => gulp.watch(cfg.copy.static.concat(cfg.copy.src), parallel('compile:copy')))

// aliases
gulp.task('compile', series('clean', parallel('compile:vendor', 'compile:sass', 'compile:ts', 'compile:react', 'compile:copy')))
gulp.task('watch', parallel('watch:sass', 'watch:ts', 'watch:react', 'watch:copy'))
gulp.task('default', parallel('compile', 'watch'))
