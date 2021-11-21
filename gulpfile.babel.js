import gulp from "gulp";
import gulpsass from "gulp-sass";
import del from "del";
import webs from "gulp-connect";
import img from "gulp-imagemin";
import autoprefixer from "gulp-autoprefixer";
import bro from "gulp-bro";
import babelify from "babelify";
import include from 'gulp-file-include';

const paths = {
    dev: {
        images: "./src/images/**",
        html: "./src/html/*",
        sass: './src/sass/*.scss',
        mainJs: './src/js/**/*.js',
        css: './src/css/**',
        font: './src/fonts/**',
        plugin: './src/lib/**'
    },
    pub: {
        images: "./dist/images",
        html: "./dist",
        sass: './dist/css',
        mainJs: './dist/js',
        font: './dist/fonts',
        plugin: './dist/lib'
    },
    watch: {
        images: "./src/images/**",
        html: "./src/html/**/*.html",
        sass: './src/sass/**/*.scss',
        mainJs: './src/js/**/*.js',
        css: './src/css/**',
        font: "./src/fonts/**",
        plugin: './src/lib/**'
    },

}

// clean
const clean = () =>
    del(["dist/*"]);
// fonts
const fonts = () =>
    gulp.src(paths.dev.font).pipe(gulp.dest(paths.pub.font))
// image
const image = () =>
    gulp.src(paths.dev.images).pipe(img()).pipe(gulp.dest(paths.pub.images));


// sass
const sass = () =>

    gulp.src(paths.dev.sass)
    .pipe(gulpsass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.pub.sass))

gulp.src(paths.dev.css)
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.pub.sass))

// js
const js = () =>
    gulp.src(paths.dev.mainJs)
    .pipe(
        bro({
            transform: [
                babelify.configure({
                    presets: ["@babel/preset-env"]
                }),
            ],
        })
    )
    .pipe(gulp.dest(paths.pub.mainJs))

const plugins = () =>
    gulp.src(paths.dev.plugin)
    .pipe(gulp.dest(paths.pub.plugin))

// server
const webserver = () =>
    webs.server({
        root: paths.pub.html, //루트 위치
        livereload: true,
        port: 8001,
    });

// include 
const includes = () =>
    gulp.src([
        paths.dev.html,
        "!" + "./src/html/include*"], 
    )
    .pipe(include({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(paths.pub.html));

// watch
const watch = () =>
gulp.watch(paths.watch.html, includes);
gulp.watch(paths.watch.sass, sass);
gulp.watch(paths.watch.css, sass);
gulp.watch(paths.watch.mainJs, js);
gulp.watch(paths.watch.images, image);
gulp.watch(paths.watch.font, fonts);
gulp.watch(paths.watch.plugin, plugins)


// clean,image
const prepare = gulp.series([clean, image, fonts]);

// pug,sass,js
const assets = gulp.series([ includes, sass,  js, plugins]);

// 서버on watch
const postDev = gulp.parallel([webserver, watch]);

// 순서대로 실행
export const dev = gulp.series([prepare, assets, postDev]);