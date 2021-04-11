const fs = require("fs");
const path = require("path");

module.exports = {
  removeImage: async (filePath) => {
    fs.unlink(path.join(__dirname, filePath), (err) => {
      console.log(`utils/index.js === removeImage == ${{ err }}`);
    });
  },
};
