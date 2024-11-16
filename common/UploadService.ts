import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  validateFile(file: Express.Multer.File): void {
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new Error('Unsupported file type');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the 5MB limit');
    }
  }

  deleteFile(filePath: string): boolean {
    try {
      const fullPath = path.resolve(filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete the file
        return true;
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
      return false;
    }
  }

  saveFile(file: Express.Multer.File, destination: string = './uploads',originalPath: string = null): string {
    this.validateFile(file);

    const timestamp = Date.now();
    const ext = extname(file.originalname);
    const originalName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${originalName}-${timestamp}-${uuidv4()}${ext}`;
    const filePath = `${destination}/${filename}`;

    // Check if file already exists, delete if necessary
    if (originalPath && fs.existsSync(originalPath)) {
      this.deleteFile(originalPath); // Delete the old file if it exists
    }

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer); // Save the new file
    return filename;
  }
}
