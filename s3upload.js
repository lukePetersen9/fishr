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
    var out = 'fail';
    var b;

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: userID + Date.now().toString(), // File name you want to save as in S3
        Body: fileName
    };
    s3.upload(params, (b = function (err, data) {
        if (err) {
            out = err.toString;
        } else {
            out = data.Location;
            console.log("out: " + out);
            console.log("Location: " + data.Location);
        }
        return 'fd';
    }));
    console.log('b: ' + b);
    return b;
}

exports.uploadFile = uploadFile;