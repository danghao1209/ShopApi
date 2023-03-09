import path from "path";

export const getImages = (req, res) => {
  try {
    const imagePath = path.join(
      path.resolve("public/imgs/"),
      `${req.params.name}`
    );
    res.sendFile(imagePath);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
