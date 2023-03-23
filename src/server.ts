import { exec } from 'child_process';
import { readFile } from 'fs';
import { createServer } from 'http'
import { Bookmark, ChildResponse, PbfParsed } from './typedefs/types';

const host = 'localhost'
const port = 8080;
let srcPath: string;
let srcName: string;
let srcExt: string;
let outputDir: string;

function split(arg: Bookmark): Promise<ChildResponse> {
  const { bookmarkName, marker } = arg;
  return new Promise<ChildResponse>((resolve, reject) => {
    exec(`ffmpeg -ss ${marker.begin.markerTime} -to ${marker.end.markerTime} -i "${srcPath}\\${srcName}" -c copy "${outputDir ?? srcPath}\\${bookmarkName}.${srcExt}"`, (err, stdout, stderr) => {
      if (err) {
        const res: ChildResponse = {
          error: {
            id: 'E000',
            level: 'critical',
            message: err.message
          },
          message: 'ffmpeg command has been rejected'
        }

        reject(res);
      }
      else {
        const res: ChildResponse = {
          error: null,
          message: 'ffmpeg command has fulfilled'
        }
        resolve(res);
      }
    });
  });
}

function setSrc(path: string): string {
  const splitted = path.split('\\');
  const filename = splitted.pop()!;

  srcPath = splitted.join('\\');
  srcName = filename;
  srcExt = filename.split('.')[1];

  return `${srcPath}\\${srcName}`;
}

function parsePBF(arg: { raw: string, out: string }, modeFlg: 'range' | 'chapter'): PbfParsed[] {
  const matchBookmarkNames: string[] = arg.raw.match(/\*.+\*/g)!;
  const matchMilliSecs: string[] = arg.raw.match(/[0-9]+=[0-9]+/g)!;

  const isEven = (matchBookmarkNames.length % 2) === 0;
  const loopSize = isEven 
                    ? matchBookmarkNames.length / 2 
                    : Math.floor(matchBookmarkNames.length / 2)

  const bookmarkNames: string[][] = [];
  const milliSecs: string[][] = [];

  for (let i = 0; i < loopSize; ++i) {
    bookmarkNames.push(matchBookmarkNames.slice(i * 2, (i * 2) + 2));
  }
  if (!isEven) {
    bookmarkNames.push([matchBookmarkNames[matchBookmarkNames.length - 1]]);
  }

  for (let i = 0; i < loopSize; ++i) {
    milliSecs.push(matchMilliSecs.slice(i * 2, (i * 2) + 2));
  }
  if (!isEven) {
    milliSecs.push([matchMilliSecs[matchMilliSecs.length - 1]]);
  }
  
  const out: PbfParsed[] = [];
  for (let i = 0; i < loopSize; ++i) {
    out.push({
      bookmarkNames: bookmarkNames[i],
      milliSecs: milliSecs[i],
    });
  }

  return out;
}

const server = createServer((request, response) => {
  switch(request.url) {
    case '/api/split': {
      request.on('data', async (chunk: Uint8Array) => {
        const parsed = JSON.parse(chunk.toString()) as Bookmark;
    
        response.setHeader('Access-Control-Allow-Origin', '*');
        try {
          const res = await split(parsed);
          response.write(
            JSON.stringify({
              error: res.error,
              message: res.message
            })
          );
        }
        catch (err) {
          response.write(
            JSON.stringify({
              error: (err as ChildResponse).error,
              message: (err as ChildResponse).message
            })
          );
        }
        finally {
          response.end();
        }
      });
      break;
    }
    case '/api/setSrc':
    case '/api/setOuputDir': {
      request.on('data', (chunk: Uint8Array) => {
        const path = chunk.toString();
        const fullPath = request.url === '/api/setSrc'
                          ? setSrc(path)
                          : outputDir = path;

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.write(
          JSON.stringify({
            error: null,
            message: fullPath
          })
        );
        response.end();
      });
      break;
    }
    case '/api/parsePBF': {
      request.on('data', (chunk: Uint8Array) => {
        response.setHeader('Access-Control-Allow-Origin', '*');

        const path = chunk.toString();
        readFile(path, 'utf16le', (err, raw) => {
          if (err) {
            response.write(
              JSON.stringify({
                error: {
                  id: 'E002',
                  level: 'critical',
                  message: err.message,
                },
                message: `Failed to open the given file path ${path.split('\\').pop()}`
              })
            );
          }
          else {
            const out = '';
            const parsed = parsePBF({ raw, out }, 'range');

            response.write(
              JSON.stringify({
                error: null,
                message: JSON.stringify(parsed),
              })
            );
          }
          response.end();
        });
      });
      break;
    }
  }
});

server.listen(port, host, () => {
  console.log(`nodejs is listening ${host}:${port}`);
});