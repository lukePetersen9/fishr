const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');

const s3 = new AWS.S3();

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

function uploadFile(fileName, userID) {
    const BUCKET_NAME = 'fishr-data/posts';
    const key = userID + Date.now().toString();
    const location = 'https://fishr-data.s3.us-east-2.amazonaws.com/posts/' + key;

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: fileName
    };
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
    });
    return location;
}

exports.uploadFile = uploadFile;