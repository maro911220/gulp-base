import gulp from "gulp";
import gulppug from "gulp-pug";
import gulpsass from "gulp-sass";
import del from "del";
import webs from "gulp-connect";
import img from "gulp-imagemin";
import autoprefixer from "gulp-autoprefixer";
import bro from "gulp-bro";
import babelify from "babelify";
import browserSync from "browser-sync";

// clean
const clean = () => 
    del(["dist/*"]);



// image
const image = () => 
    gulp.src("./src/images/*").pipe(img()).pipe(gulp.dest("./dist/images"));



// pug
const pug = () => 
    gulp.src("./src/html/**")
        .pipe(gulppug())
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.reload({ stream: true }));




// sass
const sass = () => 
    gulp.src("./src/sass/**")
        .pipe(gulpsass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.reload({ stream: true }));


// js
const js = () => 
    gulp.src("./src/js/*.js")
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }],
                ],
            })
        )
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.reload({ stream: true }));

const subPageJs = () => 
    gulp.src("./src/js/page/*.js")
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }],
                ],
            })
        )
        .pipe(gulp.dest("./dist/js/page"))
        .pipe(browserSync.reload({ stream: true }));

// server
const webserver = () => 
    webs.server({
        root: "./dist", //루트 위치
        livereload: true,
        port: 8001,
    });

 


// watch
const watch = () => 
    gulp.watch("./src/html/*.pug", pug);
    gulp.watch("./src/sass/**", sass);
    gulp.watch("./src/js/*.js", js);
    gulp.watch("./src/js/**/*.js", subPageJs);

// clean,image
const prepare = gulp.series([clean, image]);

// pug,sass,js
const assets = gulp.series([pug, sass, js,subPageJs]);

// 서버on watch
const postDev = gulp.parallel([webserver, watch]);

// 순서대로 실행
export const dev = gulp.series([prepare, assets, postDev]);
