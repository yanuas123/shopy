var multer_properties = {
    destination: function(res, file, cb) {
        cb(null, "./build/images/images"); // directory to save
    },
    filename: function(res, file, cb) {
        cb(null, file.originalname);
    }
};
module.exports = multer_properties;
