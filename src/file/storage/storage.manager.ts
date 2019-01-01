import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as FS from 'fs';
import { NextFunction } from '../../../node_modules/@types/express';
import { accessKey, secretKey, bucketName, storageURL } from './storage.config';
import { fileController } from '../file.controller';
import * as https from 'https';
import { config } from '../../config';
import * as FileErrors from '../../errors/file';

const agent_sh = new https.Agent({
  maxSockets: 25,
});

export const s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  endpoint: storageURL,
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4',
});

const storageS3 = multerS3({
  s3,
  bucket: bucketName,
  key: (req, file: Express.Multer.File, cb) => {
    // For testing
    if (config.conf_type === 'testing') {
      s3.headObject({ Bucket: bucketName, Key: 'test@test' + '/' + file.originalname }, (err, metadata) => {
        if (metadata) {
          // Handle Object already exists
          console.log('File Exists');
          cb(new FileErrors.FileExistsError());
        } else {
          cb(null, 'test@test' + '/' + file.originalname);
        }
      });
    } else {
      // For Prod/Dev
      // Check if file exists
      s3.headObject({ Bucket: bucketName, Key: (<any>req).user.id + '/' + file.originalname }, (err, metadata) => {
        if (metadata) {
          // Handle Object already exists
          console.log('File Exists');
          cb(new FileErrors.FileExistsError());
        } else {
          cb(null, (<any>req).user.id + '/' + file.originalname);
        }
      });
    }
  }
});

export const upload = multer({ storage: storageS3 }).any();
