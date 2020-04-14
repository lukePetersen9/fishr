const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAQD74I2EM2NV6MZK3';
const pass = '4+j9JJQsuabsVxPH6Bz7TQQUiCkzO5KzfEAp7pcv';


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: pass
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

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    const BUCKET_NAME = 'fishr-data/posts';

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'uh-oh', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        console.log(`File uploaded successfully. ${data.data}`);
    });
};