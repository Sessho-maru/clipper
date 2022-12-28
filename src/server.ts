import { exec } from 'child_process';
import { createServer } from 'http'
import { IBookmark, IChildResponse } from './features/splitter/types';

const host = 'localhost'
const port = 8080;
let srcPath: string;
let srcName: string;

function split(arg: IBookmark): Promise<IChildResponse> {
  const { range, name } = arg;
  return new Promise<IChildResponse>((resolve, reject) => {
    exec(`ffmpeg -ss ${range.from} -to ${range.to} -i "${srcPath}/${srcName}" -c copy ${srcPath}/${name}.mp4`, (err, stdout, stderr) => {
      if (err) {
        console.log('child process ends with errors');
        reject({ isSuccess: false, message: err.message });
      }
      else {
        console.log('child process ends without errors');
        resolve({ isSuccess: true, message: stdout });
      }
    });
  });
}

function setSrc(path: string): string {
  const slashSplited = path.split('\\');
  const filename = slashSplited.pop();

  srcPath = slashSplited.join('\\');
  srcName = filename;

  return `${srcPath}\\${srcName}`;
}

const server = createServer((request, response) => {
  switch(request.url) {
    case '/api/split': {
      request.on('data', async (chunk: Uint8Array) => {
        const parsed = JSON.parse(chunk.toString()) as IBookmark;
    
        response.setHeader('Access-Control-Allow-Origin', '*');
        try {
          const childRes = await split(parsed);
          response.write(
            JSON.stringify({
              isSuccess: true,
              message: childRes.message
            })
          );
        }
        catch (err) {
          response.write(
            JSON.stringify({
              isSuccess: false,
              message: err.message
            })
          );
        }
        finally {
          response.end();
        }
      });
      break;
    }
    case '/api/setSrc': {
      request.on('data', (chunk: Uint8Array) => {
        const path = chunk.toString();

        const fullPath = setSrc(path);

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.write(
          JSON.stringify({
            isSuccess: true,
            message: fullPath
          })
        );
        response.end();
      })
    }
  }
});

server.listen(port, host, () => {
  console.log(`nodejs is listening ${host}:${port}`);
});