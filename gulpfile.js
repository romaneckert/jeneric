const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {

    let files = [
        'README.md',
        './core/*.js',
        './entity/*.js',
        './service/*.js'
    ];

    gulp.src(files, {read: false})
        .pipe(jsdoc(cb));
});

gulp.task('default', ['doc']);