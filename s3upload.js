const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('./config.json');

const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

const createBucket = (bucketName) => {
    const params = {
        Bucket: bucketName,
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: "us-east-2"
        }
    };

    s3.createBucket(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data.Location);
    });
};

const uploadFile = (fileName, userID) => {
    console.log(userID);
    const BUCKET_NAME = 'fishr-data/posts';

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: userID + Date.now().toString(), // File name you want to save as in S3
        Body: fileName
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(`File uploaded successfully. ${data.Location}`);
        }
    });
};

exports.uploadFile = uploadFile;