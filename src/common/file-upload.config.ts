import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getFileUploadConfig = (destination: string) => ({
    storage: diskStorage({
        destination: './uploads/' + destination,
        filename: (req, file, cb) => {
            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(file.mimetype)) {
                cb(new HttpException(`Only PNG and JPEG images are allowed`, HttpStatus.BAD_REQUEST), null);
            } else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(file.originalname);
                const filename = `${uuidv4()}-${uniqueSuffix}${fileExtension}`;
                cb(null, filename);
            }


        },
    }),
});
