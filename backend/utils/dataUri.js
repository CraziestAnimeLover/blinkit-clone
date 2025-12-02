import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const dataUri = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

export default dataUri;
