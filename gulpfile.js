const routes = {
	images: {
		src: "src/img/**/*.+(jpg|jpeg|JPG|JPEG|png|PNG|svg)",
		dest: "dest/images/",
		build: "build/images/",
		watch: "src/img/**/*.+(jpg|jpeg|JPG|JPEG|png|PNG|svg)"
	},
	js: {
		src_ts: "src/ts/index.tslink.ts",
		src_js: "src/js/*.js",
		temporary: "dest/ts/",
		temp_file_name: "index.ts",
		dest: "dest/js/",
		build: "build/js/",
		watch: "src/ts/**/*.ts",
		types_src: "src/ts/@types/**/*.ts",
		types_dest: "dest/ts/@types/"
	},
	sass: {
		src: "src/sass/style.scss",
		dest: "dest/css/",
		watch: "src/sass/**/*.scss"
	},
	style: {
		src: "src/sass/**/*.css",
		dest: "dest/css/",
		build: "build/css/",
		watch: "src/sass/**/*.css"
	},
	html: {
		src: "src/*.html",
		dest: "dest/",
		build: "build/",
		watch: ["src/*.html", "src/partials/**/*.html"]
	},
	plugins: {
		src: "src/plugins/**/*",
		dest: "dest/plugins/",
		build: "build/plugins/"
	}
};

const html_include_prop = require("./html-include-prop.js");
const pass = require("./auth.js");
const prm = {
	browser: {
		server: "./dest",
		port: 3002
	},
	browser_build: {
		server: "./build",
		port: 3003
	},
	watch: {
		param: {
			ignoreInitial: false
		}
	},
	sass: {},
	css_concat_media: {},
	autoprefixer: {
		browsers: ['> 0%'],
		cascade: false
	},
	remove_console: {
		namespace: ["console"],
		methods: ["log", "dir"]
	},
	uglify: {},
	kraken: {
		key: pass.kraken.key,
		secret: pass.kraken.secret,
		lossy: true,
		concurrency: 6
	},
	rigger: {},
	include: {
		test: {
			context: html_include_prop
		},
		build: {
			context: html_include_prop
		}
	}
};

const del = require('del');
const cache = require("gulp-cached");
const browser = require("browser-sync").create();
const ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconf.json");
const {
	src,
	dest,
	series,
	parallel,
	watch
} = require("gulp");
const sasS = require("gulp-sass");
sasS.compiler = require('node-sass');
const gcmq = require("gulp-group-css-media-queries");
const autoprefixerGulp = require('gulp-autoprefixer');
const removeConsole = require('gulp-remove-logging');
const uglify = require("gulp-uglify");
const imageoptim = require("gulp-kraken");
const rigger = require("gulp-rigger");
const include = require("gulp-file-include");
const tslink = require('gulp-ts-link');



/* assist functions */
let clean_dest = null;
function clean() {
	return del(clean_dest + "**/*");
}
function cleanAll() {
	let paths = [routes.images.build + "**/*", routes.js.build + "**/*", routes.style.build + "**/*", routes.html.build + "**/*.html"];
	return del(paths);
}
function initBrowser(cb) {
	browser.init(prm.browser_build);
	cb();
}
function reload(cb) {
	browser.reload();
	cb();
}


/* working mode functions */
function put_images() {
	return src(routes.images.src)
		.pipe(dest(routes.images.dest));
}

function put_types() {
	return src(routes.js.types_src)
		.pipe(dest(routes.js.types_dest));
}
function concat_js() {
	return src(routes.js.src_ts, {
		buffer: false
	})
		.pipe(tslink(routes.js.temp_file_name))
		.pipe(dest(routes.js.temporary));
}
function compileJS() {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(dest(routes.js.dest));
}
function put_js() {
	return src(routes.js.src_js)
		.pipe(dest(routes.js.dest));
}

function compile_sass() {
	return src(routes.sass.src)
		.pipe(sasS(prm.sass).on('error', sasS.logError))
		.pipe(dest(routes.sass.dest));
}

function put_css() {
	return src(routes.style.src)
		.pipe(cache())
		.pipe(dest(routes.style.dest));
}

function compile_html() {
	prm.include.test.context.state = "test";
	return src(routes.html.src)
		.pipe(include(prm.include.test))
		.pipe(dest(routes.html.dest));
}

function move_plugins() {
	return src(routes.plugins.src)
		.pipe(dest(routes.plugins.dest));
}

/* build mode functions */
function build_images() {
	return src(routes.images.src)
		.pipe(imageoptim(prm.kraken))
		.pipe(dest(routes.images.build));
}

function build_js() {
	return src(routes.js.dest)
		.pipe(removeConsole(prm.remove_console))
		.pipe(uglify(prm.uglify))
		.pipe(dest(routes.js.build));
}

function build_css() {
	return src([routes.style.dest, "!" + routes.style.dest + "test.css"])
		.pipe(gcmq(prm.css_concat_media))
		.pipe(autoprefixerGulp(prm.autoprefixer))
		.pipe(dest(routes.style.build));
}

function build_html() {
	return src(routes.html.src)
		.pipe(include(prm.include.build))
		.pipe(dest(routes.html.build));
}

function build_plugins() {
	return src(routes.plugins.src)
		.pipe(dest(routes.plugins.build));
}

const build = parallel(build_images, build_js, build_css, build_html, build_plugins);



exports.build = series(cleanAll, build, initBrowser);
exports.default = function() {
	browser.init(prm.browser);
	parallel(move_plugins)();
	watch(routes.images.watch, prm.watch.param, series(put_images, reload));
	watch(routes.js.watch, prm.watch.param, series(put_types, concat_js, compileJS, reload));
	watch(routes.js.src_js, prm.watch.param, series(put_js, reload));
	watch(routes.style.watch, prm.watch.param, series(put_css, reload));
	watch(routes.sass.watch, prm.watch.param, series(compile_sass, reload));
	watch(routes.html.watch, prm.watch.param, series(compile_html, reload));
};