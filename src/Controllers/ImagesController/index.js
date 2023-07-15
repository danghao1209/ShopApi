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

// export const getImages = async (req, res, next) => {
//   try {
//     const imageName = req.params.name;
//     const imagePath = path.join(path.resolve("public/imgs/"), imageName);

//     // Kiểm tra xem hình ảnh có trong Redis không
//     const cachedImage = await redisClient.get(imageName);
//     if (cachedImage) {
//       // Hình ảnh đã được cache trong Redis, trả về kết quả từ Redis
//       const imageBuffer = Buffer.from(cachedImage, "base64");
//       res.writeHead(200, { "Content-Type": "image/jpeg/png" });
//       res.end(imageBuffer);
//       return;
//     }

//     // Đọc hình ảnh từ file
//     const imageStream = fs.createReadStream(imagePath);

//     // Ghi stream vào response và cache hình ảnh vào Redis
//     const chunks = [];
//     imageStream.on("data", (chunk) => {
//       chunks.push(chunk);
//     });
//     imageStream.on("end", async () => {
//       const imageBuffer = Buffer.concat(chunks);
//       res.writeHead(200, { "Content-Type": "image/jpeg/png" });
//       res.end(imageBuffer);

//       // Cache hình ảnh vào Redis
//       await redisClient.set(imageName, imageBuffer.toString("base64"));
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
