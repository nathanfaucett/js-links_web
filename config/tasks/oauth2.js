var parallel = require("@nathanfaucett/parallel"),
    filePath = require("@nathanfaucett/file_path"),
    compile = require("./comn").compile;


module.exports = function(config) {
    return function(done) {
        compile({
            index: config.paths.oauth2_js_src,
            out: config.paths.oauth2_js_out,
            generateSourceMap: true,
            outSourceMap: config.paths.oauth2_js_map_out
        }, done);
    };
};
