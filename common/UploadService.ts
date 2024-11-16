import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  validateFile(file: Express.Multer.File): void {
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type!');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds the limit of 5MB!');
    }
  }

  saveFile(file: Express.Multer.File, destination: string = './uploads'): string {
    this.validateFile(file);

    const filename = `${uuidv4()}${extname(file.originalname)}`;
    const filePath = `${destination}/${filename}`;

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    return filename;
  }
}
