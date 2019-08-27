const routes = {
	images: {
		src: "src/img/**/*.+(jpg|jpeg|JPG|JPEG|png|PNG|svg)",
		build_src: "src/img/**/*.svg",
		src_kraken: "src/img/**/*.+(jpg|jpeg|JPG|JPEG|png|PNG)",
		dest: "dest/images/",
		build: "build/images/",
		watch: "src/img/**/*.+(jpg|jpeg|JPG|JPEG|png|PNG|svg)"
	},
	js: {
		ts: {
			src_ts: "src/ts/index.tslink.ts",
			temporary: "temp/ts/",
			temp_file_name: "index.ts",
			dest_file_name: "index.js",
			watch: "src/ts/**/*.ts",
			types_src: "src/ts/@types/**/*.ts",
			types_dest: "temp/ts/@types/"
		},
		js: {
			temporary: "temp/js/",
			src_js: "src/js/*.js",
			dest: "dest/js/",
			build: "build/js/"
		}
	},
	sass: {
		src: "src/sass/style.scss",
		dest: "dest/css/",
		watch: "src/sass/**/*.scss"
	},
	style: {
		src: "src/sass/**/*.css",
		build_src: ["dest/css/**/*.css", "!dest/css/test.css"],
		dest: "dest/css/",
		build: "build/css/",
		watch: "src/sass/**/*.css"
	},
	html: {
		src: ["src/**/*.html"],
		src_temp: "temp/html/*.html",
		build_temp: "temp/html/",
		dest: "dest/",
		build: "build/",
		watch: ["src/*.html", "src/partials/**/*.html"]
	},
	plugins: {
		src: "src/plugins/**/*",
		dest: "dest/plugins/",
		build: "build/plugins/"
	},
	fonts: {
		src: "src/fonts/**/*.+(ttf|otf|woff|eot)",
		dest: "dest/fonts/",
		build: "build/fonts/"
	},
	server: {
		path: "server.js"
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
		overrideBrowserslist: ['> 0%'],
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
	},
	nodemon: {
		prop: {
			script: routes.server.path,
			ext: "",
			delay: "2000"
		},
		crash: function() {
			console.error("Crash server!");
		},
		restart: function() {
			console.log("Server restart!");
		}
	},
	html_beautify: {
		"indent_size": 1,
		"eol": "\n",
		"indent_level": 0,
		"indent_with_tabs": true,
		"preserve_newlines": true,
		"max_preserve_newlines": 2,
		"brace_style": "collapse",
		"end_with_newline": false
	},
	html_del_dirty: {
		layout: {
			plain: {
				s: "#{2}", // custom episode hash
				r: ""
			}
		},
		node: {
			plain: {
				s: "#{2}[\\w\\W\\s]+?#{2}", // custom episode
				r: ""
			},
			attr: {
				s: "",
				r: ""
			},
			loop: {
				s: "@{2}for[\\w\\W]+?\\{[\\w\\W\\s]+?\\}", // loop @@for
				r: function(rep) {
					rep = rep.replace(/@{2}for[\w\W^{]+?\{/, "");
					rep = rep.substring(0, rep.length - 1);
					return rep;
				}
			},
			insert1: {
				s: "\\`\\+.{1,}?\\+\\`", // variable insertion `+ +`
				r: ""
			}
		},
		php: {
			plain: {
				s: "#{2}[\\w\\W\\s]+?#{2}", // custom episode
				r: ""
			},
			attr: {
				s: "data-in\\=\".+?\"", // attribute for connect any data to tags
				r: ""
			},
			loop: {
				s: "@{2}for[\\w\\W]+?\\{[\\w\\W\\s]+?\\}", // loop @@for
				r: function(rep) {
					rep = rep.replace(/@{2}for[\w\W]+?\{/, "<!-- LOOP =============== -->");
					rep = rep.substring(0, rep.length - 1);
					return rep + "<!-- end LOOP =============== -->";
				}
			},
			insert1: {
				s: "\\`\\+.{1,}?\\+\\`", // variable insertion `+ +`
				r: ""
			}
		},
		mode: "node" // here value can be 'node' or 'php'. It set some difference in end build compiling.
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
const nodemon = require("gulp-nodemon");
const html_beautify = require('gulp-html-beautify');
const replace_str = require('gulp-inject-string');
const sourcemap = require("gulp-sourcemaps");



/* assist functions */
let clean_dest = null;
function clean() {
	return del(clean_dest + "**/*");
}
function cleanAll() {
	let paths = [routes.images.build + "**/*", routes.js.js.build + "**/*", routes.style.build + "**/*", routes.html.build + "**/*.html", routes.plugins.build + "**/*", routes.fonts.build + "**/*"];
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

/* typescript compile */
function put_types() {
	return src(routes.js.ts.types_src)
		.pipe(dest(routes.js.ts.types_dest));
}
function concat_ts() {
	return src(routes.js.ts.src_ts, {
		buffer: false
	})
		.pipe(tslink(routes.js.ts.temp_file_name))
		.pipe(dest(routes.js.ts.temporary));
}
function compileTS() {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(dest(routes.js.js.temporary));
}
let constructJS = series(put_types, concat_ts, compileTS);




/* working mode functions ----------------- */
function put_images() {
	return src(routes.images.src)
		.pipe(dest(routes.images.dest));
}

function put_js() {
	return src(routes.js.js.src_js)
		.pipe(dest(routes.js.js.dest));
}

function compile_sass() {
	return src(routes.sass.src)
		.pipe(sourcemap.init())
		.pipe(sasS(prm.sass).on('error', sasS.logError))
		.pipe(sourcemap.write())
		.pipe(dest(routes.sass.dest));
}

function put_css() {
	return src(routes.style.src)
		.pipe(cache())
		.pipe(dest(routes.style.dest));
}

function html_del_loops() {
	let prop = prm.html_del_dirty.layout;
	return src(routes.html.src)
		.pipe(replace_str.replace(prop.plain.s, prop.plain.r))
		.pipe(dest(routes.html.build_temp));
}
function compile_html() {
	prm.include.test.context.state = "test";
	return src(routes.html.src_temp)
		.pipe(include(prm.include.test))
		.pipe(dest(routes.html.dest));
}
let constructHTML = series(html_del_loops, compile_html);

function put_plugins() {
	return src(routes.plugins.src)
		.pipe(dest(routes.plugins.dest));
}

function put_fonts() {
	return src(routes.fonts.src)
		.pipe(dest(routes.fonts.dest));
}

/* build1 mode functions ----------------- */
function build1_put_images() {
	return src(routes.images.src)
		.pipe(dest(routes.images.build));
}

function build1_compileTS() {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(dest(routes.js.js.build));
}
let build1_constructJS = series(put_types, concat_ts, build1_compileTS);
function build1_put_js() {
	return src([routes.js.js.src_js, "!src/js/test.js"])
		.pipe(dest(routes.js.js.build));
}

function build1_compile_sass() {
	return src(routes.sass.src)
		.pipe(sourcemap.init())
		.pipe(sasS(prm.sass).on('error', sasS.logError))
		.pipe(sourcemap.write())
		.pipe(dest(routes.style.build));
}

function build1_put_css() {
	return src(routes.style.src)
		.pipe(cache())
		.pipe(dest(routes.style.build));
}

function build1_html_del_loops() {
	let prop = prm.html_del_dirty.node;
	return src(routes.html.src)
		.pipe(replace_str.replace(prop.plain.s, prop.plain.r))
		.pipe(replace_str.replace(prop.loop.s, prop.loop.r))
		.pipe(replace_str.replace(prop.insert1.s, prop.insert1.r))
		.pipe(dest(routes.html.build_temp));
}
function build1_html() {
	prm.include.build.context.state = "none";
	return src(routes.html.build_temp + "*.html")
		.pipe(include(prm.include.build))
		.pipe(dest(routes.html.build));
}
let build1_constructHTML = series(build1_html_del_loops, build1_html);

function build1_put_plugins() {
	return src(routes.plugins.src)
		.pipe(dest(routes.plugins.build));
}

function build1_put_fonts() {
	return src(routes.fonts.src)
		.pipe(dest(routes.fonts.build));
}

/* build2 mode functions ----------------- */
function build2_put_svg() {
	return src(routes.images.build_src)
		.pipe(dest(routes.images.build));
}
function build2_put_kraken() {
	return src(routes.images.src_kraken)
		.pipe(imageoptim(prm.kraken))
		.pipe(dest(routes.images.build));
}
let build2_put_images = parallel(build2_put_svg, build2_put_kraken);

function build2_put_js() {
	return src([routes.js.js.temporary + routes.js.ts.dest_file_name, "!src/js/test.js", routes.js.js.src_js])
		.pipe(removeConsole(prm.remove_console))
		.pipe(uglify(prm.uglify))
		.pipe(dest(routes.js.js.build));
}
let build2_compileJS = series(constructJS, build2_put_js);

function build2_compile_sass() {
	return src(routes.sass.src)
		.pipe(sasS(prm.sass).on('error', sasS.logError))
		.pipe(dest(routes.sass.dest));
}
function build2_put_css() {
	return src(routes.style.build_src)
		.pipe(gcmq(prm.css_concat_media))
		.pipe(autoprefixerGulp(prm.autoprefixer))
		.pipe(dest(routes.style.build));
}
let build2_construct_css = series(build2_compile_sass, put_css, build2_put_css);

function build2_html_del_loops() {
	let prop;
	if(prm.html_del_dirty.mode == "node") prop = prm.html_del_dirty.node;
	else if(prm.html_del_dirty.mode == "php") prop = prm.html_del_dirty.php;
	return src(routes.html.src)
		.pipe(replace_str.replace(prop.plain.s, prop.plain.r))
		.pipe(replace_str.replace(prop.attr.s, prop.attr.r))
		.pipe(replace_str.replace(prop.loop.s, prop.loop.r))
		.pipe(replace_str.replace(prop.insert1.s, prop.insert1.r))
		.pipe(dest(routes.html.build_temp));
}
function build2_html() {
	prm.include.build.context.state = "none";
	return src(routes.html.build_temp + "*.html")
		.pipe(include(prm.include.build))
		.pipe(html_beautify(prm.html_beautify))
		.pipe(dest(routes.html.build));
}
let build2_constructHTML = series(build2_html_del_loops, build2_html);



// finish build - clear files and optimized images
const build_end_ = parallel(build2_put_images, build2_compileJS, build2_construct_css, build2_constructHTML, build1_put_plugins, build1_put_fonts);
exports.build_end = series(cleanAll, build_end_);

// working build with dirty files and without html loops and test urls. Use custom server for watch
exports.build = function() {
	nodemon(prm.nodemon.prop)
		.on("crash", prm.nodemon.crash)
		.on("restart", prm.nodemon.restart);
	parallel(build1_put_plugins, build1_put_fonts)();
	watch(routes.images.watch, prm.watch.param, series(build1_put_images));
	watch(routes.js.ts.watch, prm.watch.param, series(build1_constructJS));
	watch(routes.js.js.src_js, prm.watch.param, series(build1_put_js));
	watch(routes.style.watch, prm.watch.param, series(build1_put_css));
	watch(routes.sass.watch, prm.watch.param, series(build1_compile_sass));
	watch(routes.html.watch, prm.watch.param, series(build1_constructHTML));
};
// mode to edit templates with dirty files
exports.default = function() {
	browser.init(prm.browser);
	parallel(put_plugins, put_fonts)();
	watch(routes.images.watch, prm.watch.param, series(put_images, reload));
	watch(routes.js.js.src_js, prm.watch.param, series(put_js, reload));
	watch(routes.style.watch, prm.watch.param, series(put_css, reload));
	watch(routes.sass.watch, prm.watch.param, series(compile_sass, reload));
	watch(routes.html.watch, prm.watch.param, series(constructHTML, reload));
};