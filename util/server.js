import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import AWS from 'aws-sdk';
import formidable from 'formidable';



AWS.config.update({
  region: 'us-east-1', accessKeyId: 'AKIAU67O6WCPVGB6SCJW',
  secretAccessKey: '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'
});

const s3 = new AWS.S3();
const bucketName = 'gaussian-splatting';
const imageFolder = 'thumbnails/';

let baseDirectory = '.';
let port = 7000;
let host = '127.0.0.1';
let lasttRequesTime = performance.now() / 1000;
for (let i = 0; i < process.argv.length; ++i) {
  if (process.argv[i] == '-d' && i < process.argv.length - 1) {
    baseDirectory = process.argv[i + 1];
  }
  if (process.argv[i] == '-p' && i < process.argv.length - 1) {
    port = process.argv[i + 1];
  }
  if (process.argv[i] == '-h' && i < process.argv.length - 1) {
    host = process.argv[i + 1];
  }
}

http
  .createServer(async function (request, response) {
    if (request.url === '/upload' && request.method.toLowerCase() === 'post') {
      const form = formidable();

      form.parse(request, (err, fields, files) => {
        if (err) {
          console.error('Error parsing the files');
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Server error');
          return;
        }
        console.log("files", files.filetoupload)
        console.log("filename", files.filetoupload[0].filepath)
        const filePath = files.filetoupload[0].filepath;
        console.log(filePath)

        // Specify the S3 bucket upload parameters
        const uploadParams = {
          Bucket: bucketName,
          Key: `videos/${path.basename(files.filetoupload[0].originalFilename)}`,
          Body: fs.createReadStream(filePath)
        };

        // Upload the file to S3
        s3.upload(uploadParams, function (s3Err, data) {
          if (s3Err) {
            console.error('Error uploading to S3', s3Err);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Failed to upload video');
            return;
          }
          console.log(`File uploaded successfully at ${data.Location}`);
          response.writeHead(302, {
            'Location': 'http://127.0.0.1:5500/app/automation' // Change this URL to the location you want to redirect to
          });
          response.end();
        });
      });
      return;
    }

    if (request.url.startsWith('/Getfilepath')) {
      // console.log("pathfunction")
      const requestUrl = new URL(request.url, `http://${request.headers.host}`);
      const itemId = requestUrl.searchParams.get('itemId');
      // console.log("path", itemId)
      const searchDirectory = './build/demo/assets/data'; // Directory to search
      let qwerty = "";


      // Function to search files for the keyword
      try {
        fs.readdir(searchDirectory, { withFileTypes: true }, (err, files) => {
          if (err) {
            console.error(`Error reading directory: ${searchDirectory}`, err);
            console.error('Error reading image directory', err);
            response.writeHead(500);
            response.end('Server error occurred');
            return;
          }

          files.forEach(file => {
            const filePath = path.join(searchDirectory, file.name);

            // console.log("123", filePath)

            const p1 = filePath.split('\\')
            const p2 = p1[p1.length - 1].split('.')
            if (p2[0] == itemId) {
              // console.log("path", filePath)
              const dir = "assets/data";
              qwerty = path.join(dir, file.name);;
              // console.log("qwerty--", qwerty)
              response.writeHead(200, { 'Content-Type': 'text/plain' });
              response.end(qwerty);
              return;
            }
          });
        });
      }
      catch (error) {
        console.error(' error:', error);
        response.writeHead(500);
        response.end('Server error occurred');
      }

      return;

    }
    if (request.url.startsWith('/downloadImages')) {
      const params1 = {
        Bucket: 'gaussian-splatting',
        Prefix: 'thumbnails/'
      };
      const params2 = {
        Bucket: 'gaussian-splatting',
        Prefix: 'outputs/'
      };
      try {
        const s3Response = await s3.listObjectsV2(params1).promise();
        const downloadPath1 = './build/demo/assets/images';
        if (!fs.existsSync(downloadPath1)) {
          fs.mkdirSync(downloadPath1, { recursive: true });
        }
        const imagesd = s3Response.Contents.map(item => {
          return new Promise((resolve, reject) => {
            const params = {
              Bucket: bucketName,
              Key: item.Key,
            };

            const filePath = path.join(downloadPath1, path.basename(item.Key));
            const fileStream = fs.createWriteStream(filePath);
            s3.getObject(params).createReadStream().pipe(fileStream)
              .on('close', resolve)
              .on('error', reject);
          });
        });
        const s3Response2 = await s3.listObjectsV2(params2).promise();
        const downloadPath2 = './build/demo/assets/data';
        if (!fs.existsSync(downloadPath2)) {
          fs.mkdirSync(downloadPath2, { recursive: true });
        }
        const ply = s3Response2.Contents.map(item => {
          return new Promise((resolve, reject) => {
            const params = {
              Bucket: bucketName,
              Key: item.Key,
            };

            const filePath = path.join(downloadPath2, path.basename(item.Key));
            const fileStream = fs.createWriteStream(filePath);
            s3.getObject(params).createReadStream().pipe(fileStream)
              .on('close', resolve)
              .on('error', reject);
          });
        });
      } catch (error) {
        console.error('S3 ListObjectsV2 error:', error);
        response.writeHead(500);
        response.end('Server error occurred');
      }
      return;
    }
    if (request.url === '/imageList') {
      const imageDir = path.join(baseDirectory, 'assets/images');
      try {
        fs.readdir(imageDir, (err, files) => {
          if (err) {
            console.error('Error reading image directory', err);
            response.writeHead(500);
            response.end('Server error occurred');
            return;
          }

          const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(imageFiles), "utf-8");
          console.log('images', JSON.stringify(imageFiles));
        });
      } catch (error) {
        console.error('S3 ListObjectsV2 error:', error);
        response.writeHead(500);
        response.end('Server error occurred');
      }

      return;
    }


    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

    let filePath = baseDirectory + request.url;

    const extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
    }

    const requestTime = performance.now() / 1000;
    if (requestTime - lasttRequesTime > 1) {
      console.log("");
      console.log("-----------------------------------------------");
    }

    let queryString;
    let queryStringStart = filePath.indexOf('?');
    if (queryStringStart && queryStringStart > 0) {
      queryString = filePath.substring(queryStringStart + 1);
      filePath = filePath.substring(0, queryStringStart);
    }

    let testDirectory = filePath;
    if (testDirectory.endsWith("/")) {
      testDirectory = testDirectory.substring(0, testDirectory.length - 1);
    }
    try {
      if (fs.lstatSync(filePath).isDirectory()) {
        let testDirectory = filePath;
        if (!testDirectory.endsWith("/")) testDirectory = testDirectory + "/";
        if (fs.existsSync(testDirectory + "index.html")) {
          filePath = testDirectory + "index.html";
        } else if (fs.existsSync(testDirectory + "index.htm")) {
          filePath = testDirectory + "index.htm";
        }
      }
    } catch (err) {
    }

    try {
      const stats = fs.statSync(filePath);
      if (stats && stats.size) {
        const fileSizeInBytes = stats.size;
        response.setHeader("Content-Length", fileSizeInBytes);
      }
    } catch (err) {
    }

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          console.log("HTTP(404) Request for " + filePath + " -> File not found.");
        } else {
          console.log("HTTP(500)) Request for " + filePath + " -> Server error.");
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
            error.code +
            " ..\n"
          );
          response.end();
        }
      } else {
        console.log("HTTP(200) Request for " + filePath);
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });

    lasttRequesTime = requestTime;
  })
  .listen(port, host);
console.log("Server running at " + host + ':' + port);