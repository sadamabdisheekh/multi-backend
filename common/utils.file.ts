import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

export function saveFile(file: Express.Multer.File, uploadPath: string): any {
    
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    throw new BadRequestException('Only image files are allowed!');
  }

  // Ensure the upload directory exists
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = extname(file.originalname);
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  const filePath = join(uploadPath, filename);

  writeFileSync(filePath, file.buffer);
  
  return {
    filename,
    filePath
  };
}

export function deleteFile(filePath: string): void {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}
