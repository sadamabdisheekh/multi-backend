import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const getFileUploadConfig = (destination: string) => ({
    storage: diskStorage({
        destination: './uploads/' + destination,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            const filename = `${uuidv4()}-${uniqueSuffix}${fileExtension}`;
            cb(null, filename);
        },
    }),
});
