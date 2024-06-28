import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const tf_data = JSON.parse(fs.readFileSync(req.cookies.tf_file, "utf8"));
  const normalized_authors = JSON.parse(fs.readFileSync(req.cookies.nor_Authors_file, "utf8"));
  const top_authors = JSON.parse(fs.readFileSync(req.cookies.topAuthors_file, "utf8"));
  const meta_data = JSON.parse(fs.readFileSync(req.cookies.meta_data_file, "utf8"));

  res.status(200).json({
    tf_data,
    normalized_authors,
    top_authors,
    meta_data,
  });
}
