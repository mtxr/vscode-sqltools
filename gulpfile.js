const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const reactify = require('reactify')
const tsProject = ts.createProject('tsconfig.json')

const dest = './dist'

gulp.task('compile:ts', () => {
  gulp.src('./package.json').pipe(gulp.dest(dest))
  gulp.src('./src/resources/**/*').pipe(gulp.dest(`${dest}/resources`))

  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return tsResult.js
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: (file) => { return './../src' }
    }))
    .pipe(gulp.dest(dest))
})

gulp.task('compile:views', () => {
  gulp.src('./src/views/statistics.html')
    .pipe(gulp.dest(`${dest}/views/statistics.html`))

  const bundler = browserify({ entries: ['./src/views/js/statistics.jsx'] })
    .transform(reactify)

  function rebundle () {
    const stream = bundler.bundle({ debug: true })
    return stream.on('error', console.error)
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: (file) => {
          console.log(file.cwd + '/src')
          return file.cwd + '/src'
        }
      }))
      .pipe(gulp.dest(`${dest}/views/js/`))
  }
  bundler.on('update', function () {
    rebundle()
  })
})

gulp.task('watch:ts', () => {
  gulp.watch([
    './src/**/*.ts',
    './package.json'
  ], ['compile:ts'])
})

gulp.task('watch:views', () => {
  gulp.watch([
    './src/views/*.html',
    './src/views/**/*.html',
    './src/views/*.sass',
    './src/views/**/*.sass',
    './src/views/*.jsx',
    './src/views/**/*.jsx'
  ], ['compile:views'])
})

gulp.task('compile', ['compile:ts', 'compile:views'])
gulp.task('watch', ['watch:ts', 'watch:views'])

gulp.task('default', ['compile', 'watch'])
