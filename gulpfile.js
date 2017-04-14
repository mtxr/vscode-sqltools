const gulp = require('gulp')
const mocha = require('gulp-mocha')
const istanbul = require('gulp-istanbul')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

function runTests () {
  // Here we're piping our `.js` files inside the `test` folder
  return gulp.src(['./out/test/**/*.test.js'])
    // You can change the reporter if you want, try using `nyan`
    .pipe(mocha({
      reporter: 'spec'
    }))
}

gulp.task('compile', function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('out'))
})

gulp.task('pre-test', ['compile'], function () {
  // This tells gulp which files you want to pipe
  // In our case we want to pipe every `.js` file inside any folders inside `test`
  return gulp.src('./out/**/*.js')
    .pipe(istanbul({includeUntested: true}))
    // This overwrites `require` so it returns covered files
    .pipe(istanbul.hookRequire())
})

gulp.task('test', ['compile'], function () {
  runTests()
})

gulp.task('coverage', ['pre-test'], function () {
  runTests()
    // Here we will create report files using the test's results
    .pipe(istanbul.writeReports())
})

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['compile'])
  gulp.watch('./test/**/*.ts', ['compile'])
})

gulp.task('default', ['watch', 'coverage'])
