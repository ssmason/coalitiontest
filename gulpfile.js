const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const browsersync = require('browser-sync').create();
const gutil = require('gulp-util');

const dir = {
    src: 'src/',
    build: './'
};

// CSS settings
var css = {
    src: dir.src + 'assets/style.scss',
    watch: dir.src + 'assets/**/*',
    build: dir.build,
    sassOpts: {
        outputStyle: 'nested', 
        precision: 3,
        errLogToConsole: true
    },
    processors: [
        require('postcss-assets')({
            basePath: dir.build,
            baseUrl: 'wp-content/themes/ct-custom/'
        }),
        require('css-mqpacker'),
        require('cssnano')
    ]
};

// CSS processing
gulp.task('css', () => {
    return gulp.src(css.src)
        .pipe(sass(css.sassOpts).on('error', sass.logError)) // Improved error handling
        .pipe(postcss(css.processors))
        .pipe(gulp.dest(css.build + 'assets/')) // Save in theme assets directory
        .pipe(browsersync.stream());
});

// For BrowserSync
const reload = (cb) => { browsersync.reload(); cb(); };

gulp.task('watch', () => {
    browsersync.init({
        proxy: 'http://coalitiontest.local' // Adjust proxy for local WP site
    });
    gulp.watch(css.watch, gulp.series('css'));
    gulp.watch('*.php').on('change', reload);
});