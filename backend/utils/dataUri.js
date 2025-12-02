import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const dataUri = (file) => {
  return parser.format(path.extname(file.originalname), file.buffer);
};

export default dataUri;
