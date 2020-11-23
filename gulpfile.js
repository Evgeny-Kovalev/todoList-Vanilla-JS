let projectFolder = "dist",
	sourceFolder  = "src";

let path = {
	build: {
		html: projectFolder + "/", 
		css:  projectFolder + "/css/", 
		js:   projectFolder + "/js/", 
		img:  projectFolder + "/img/", 
	},
	src: {
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "*/_*.html"], 
		css:  sourceFolder + "/scss/style.scss", 
		js:   sourceFolder + "/js/main.js", 
		img:  sourceFolder + "/img/**/*.+(png|jpg|gif|svg)", 
	},
	watch: {
		html: sourceFolder + "/**/*.html", 
		css:  sourceFolder + "/scss/**/*.scss", 
		js:   sourceFolder + "/js/**/*.js", 
		img:  sourceFolder + "/img/**/*", 
	},
	clean: "./" + projectFolder + "/"
}

const { src, dest } = require("gulp"),
	gulp 		    = require("gulp"), 
	fileInc 	    = require("gulp-file-include"), 
	del			    = require("del"), 

  	scss		    = require("gulp-sass"), 
  	media 		    = require("gulp-group-css-media-queries"), 
  	autoprefixer    = require("gulp-autoprefixer"), 
  	cleanCss 	    = require("gulp-clean-css"), 

  	minJs 		    = require("gulp-uglify-es").default, 
  	rename 		    = require("gulp-rename"), 
  	// imagemin 		= require("gulp-imagemin"), 
	browsersync     = require("browser-sync").create();

function browserSync(params) {
 	browsersync.init({
 		server: {
 			baseDir: path.clean
 		},
 		port: 3000,
 		notify: false
 	})
}

function html() {
	return src(path.src.html)
	.pipe(fileInc())
	.pipe(dest(path.build.html))
	.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)
	.pipe(
		scss({
			outStyle: "expanded"
		})
	)
	.pipe(media())
	.pipe(autoprefixer({
		overrideBrowserslist: ["last 5 versions"],
		cascade: true
		})
	)
	.pipe(dest(path.build.css))
	.pipe(cleanCss())
	.pipe(
		rename({
			extname: ".min.css"
		})
	)
	.pipe(dest(path.build.css))
	.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
	.pipe(fileInc())
	.pipe(dest(path.build.js))
	.pipe(minJs())
	.pipe(
		rename({
			extname: ".min.js"
		})
	)
	.pipe(dest(path.build.js))
}

function images() {
	return src(path.src.img)
	.pipe(dest(path.build.img))
	.pipe(browsersync.stream())
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean() {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images)); 
let watch = gulp.parallel(build, watchFiles, browserSync); 

exports.images  = images;
exports.js 	    = js;
exports.css     = css;
exports.html    = html;
exports.build   = build;
exports.watch   = watch;
exports.default = watch;