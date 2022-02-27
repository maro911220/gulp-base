import gulp from "gulp";
import gulpInclude from 'gulp-file-include'
import del from "del";
import image from "gulp-image";
import ws from "gulp-webserver";
import gulpAutoprefixer from "gulp-autoprefixer";
import bro from "gulp-bro";
import babelify from "babelify";
const sass = require("gulp-sass")(require("node-sass"));

// 경로 설정 
const routes ={
    html:{
        watch:"src/**/*.html",
        src:"src/*.html",
        dest:"build"
    },
    img:{
        src:"src/img/*",
        dest:"build/img"
    },
    sass:{
        watch:"src/sass/**",
        src:"src/sass/*.scss",
        dest:"build/css"
    },
    js:{
        watch:"src/js/*",
        src:"src/js/*",
        dest:"build/js"
    },
    lib:{
        src:"src/lib/*",
        dest:"build/lib"
    }
}

const clean = ()=> 
    del(["build"]);

const html =()=>
    gulp
        .src(routes.html.src)
        .pipe(gulpInclude())
        .pipe(gulp.dest(routes.html.dest));

const img  =()=>
     gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const style =()=>
    gulp.src(routes.sass.src)
        .pipe(sass())
        .pipe(gulpAutoprefixer())
        .pipe(gulp.dest(routes.sass.dest))

const js = () =>
    gulp.src(routes.js.src)
    .pipe(bro({
        transform: [
            babelify.configure({
                presets: ["@babel/preset-env"],
            })
        ]
    }))
    .pipe(gulp.dest(routes.js.dest))

const lib = ()=>
    gulp.src(routes.lib.src)
        .pipe(gulp.dest(routes.lib.dest))

const webserver = () =>
    gulp
        .src("build")
        .pipe(ws({livereload:true, open:true}));

const watch =()=>
    gulp.watch(routes.html.watch, html)
    gulp.watch(routes.sass.watch, style)
    gulp.watch(routes.js.watch, js)

    
const prepare = gulp.series([clean,img]);
const assets = gulp.series([html,style,js,lib]);
const postDev = gulp.parallel([webserver, watch])


export const dev = gulp.series([prepare,assets,postDev]);