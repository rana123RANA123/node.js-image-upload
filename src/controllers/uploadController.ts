import { Request, Response, NextFunction } from 'express';
import Image from '../models/imageModel';
import path from "path";
import fs from "fs";

// POST image controller using async/await 
export const processImage = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validate input
    if (!req.file) {
      res.status(400).json({
        status: "Error",
        message: "Please upload an Image",
      });
    }
    // Create image
    const uploadImage = new Image({
      img: req.file?.buffer.toString("base64"),
    });

    await uploadImage.save();

    const response = {
      message: "file uploaded sucessfully",
      imageUrl: `/get_image/${uploadImage._id}`,
      details: {
        fileName: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype,
      },
    };

    res.status(200).json({
      response: response
    })

  } catch (error: any) {
    next(error);
  }
}
);

// GET image controller using async/await 
// export const getImage = (async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const image = await Image.findById(req.params.id);
//     if (!image) {
//       return res.status(404).json({
//         status: "Error",
//         message: "Image not found",
//       });
//     }
//     const imgBuffer = Buffer.from(image.img, 'base64');
//     res.writeHead(200, {
//       'Content-Type': 'image/jpeg',
//       'Content-Length': imgBuffer.length
//     });
//     res.end(imgBuffer);
//   } catch (error: any) {
//     next(error);
//   }
// });


export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image || !image.img) {
      return res.status(404).json({
        status: "Error",
        message: "Image not found",
      });
    }

    // Build image path
    const imagePath = path.join(__dirname, "../uploads", image.img);
    console.log("Serving image from:", imagePath); // Log for debugging

    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      res.contentType("image/jpeg"); // Set content type based on your image type
      return res.sendFile(imagePath);
    } else {
      return res.status(404).json({
        status: "Error",
        message: "Image file not found",
      });
    }
  } catch (error: any) {
    next(error);
  }
};