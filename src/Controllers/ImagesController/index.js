import path from "path";
import fs from "fs";

export const getImages = (req, res) => {
  try {
    const imagePath = path.join(
      path.resolve("public/imgs/"),
      `${req.params.name}`
    );

    res.writeHead(200, { "Content-Type": "image/jpeg/png" });

    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
    res.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
