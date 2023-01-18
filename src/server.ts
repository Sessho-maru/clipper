import { exec } from 'child_process';
import { createServer } from 'http'
import { readFile } from 'fs';
import { 
  IBookmark, IChildResponse, IParsedRaw,
  PathUtil
} from './features/splitter/define';

const host = 'localhost'
const port = 8080;
let srcPath: string;
let srcName: string;
let outputPath: string;

function split(arg: IBookmark): Promise<IChildResponse> {
  const { range, name } = arg;
  return new Promise<IChildResponse>((resolve, reject) => {
    exec(`ffmpeg -ss ${range.from} -to ${range.to} -i "${srcPath}\\${srcName}" -c copy "${outputPath ?? srcPath}\\${name}.mp4"`, (err, stdout, stderr) => {
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
  const splitted = PathUtil.splitIntoDirectories(path);
  const filename = splitted.pop();

  srcPath = PathUtil.combineAsPath(splitted);
  srcName = filename;

  return `${srcPath}\\${srcName}`;
}

function parseInjection(arg: { raw: string, out: string }, modeFlg: 'range' | 'chapter'): IParsedRaw[] {
  const matchBkName: string[] = arg.raw.match(/\*.+\*/g);
  const matchBkMs: string[] = arg.raw.match(/[0-9]+=[0-9]+/g);

  const isEven = (matchBkName.length % 2) === 0;
  const loopSize = modeFlg === 'range' 
                    ? isEven 
                      ? matchBkName.length / 2 
                      : Math.floor(matchBkName.length / 2)
                    : matchBkName.length;

  const bkNameArr: string[][] = [];
  const bkMsArr: string[][] = [];

  if (modeFlg === 'range') {
    for (let i = 0; i < loopSize; ++i) {
      bkNameArr.push(matchBkName.slice(i * 2, (i * 2) + 2));
    }
    if (!isEven) {
      bkNameArr.push([matchBkName[matchBkName.length - 1]]);
    }

    for (let i = 0; i < loopSize; ++i) {
      bkMsArr.push(matchBkMs.slice(i * 2, (i * 2) + 2));
    }
    if (!isEven) {
      bkMsArr.push([matchBkMs[matchBkMs.length - 1]]);
    }
  }
  else {
    for (let i = 0; i < loopSize; ++i) {
      bkNameArr.push([matchBkName[i]]);
      bkMsArr.push([matchBkMs[i]]);
    }
  }
  
  const out: IParsedRaw[] = [];
  for (let i = 0; i < loopSize; ++i) {
    out.push({
      nameArr: bkNameArr[i],
      msArr: bkMsArr[i],
    });
  }

  return out;
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
    case '/api/setSrc':
    case '/api/setOuputPath': {
      request.on('data', (chunk: Uint8Array) => {
        const path = chunk.toString();
        const fullPath = request.url === '/api/setSrc'
                        ? setSrc(path)
                        : outputPath = path;

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.write(
          JSON.stringify({
            isSuccess: true,
            message: fullPath
          })
        );
        response.end();
      });
      break;
    }
    case '/api/parseInjection': {
      request.on('data', (chunk: Uint8Array) => {
        response.setHeader('Access-Control-Allow-Origin', '*');

        const path = chunk.toString();
        readFile(path, 'utf16le', (err, raw) => {
          if (err) {
            response.write(
              JSON.stringify({
                isSuccess: false,
                message: `Failed to open the given file ${PathUtil.getFilename(path)}`,
              })
            );
          }
          else {
            const out = '';
            const parsed = parseInjection({ raw, out }, 'range');

            response.write(
              JSON.stringify({
                isSuccess: true,
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