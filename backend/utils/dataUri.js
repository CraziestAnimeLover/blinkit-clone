import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const dataUri = (file) => {
  if (!file) return null;

  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default dataUri;
