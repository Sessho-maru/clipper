import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IBookmark, IChildResponse } from "./types";

async function trySetSrc(path: string): Promise<string> {
  const fullPath = await runChildProcessSetSrc(path);

  return new Promise<string>((resolve) => {
    resolve(fullPath);
  })
}

async function runChildProcessSetSrc(path: string): Promise<string> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://localhost:8080/api/setSrc',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: path,
  };

  const res = await axios(axiosConfig);

  return new Promise<string>((resolve) => {
    resolve(res.data.message);
  })
}

async function trySplit(arg: IBookmark[]): Promise<string[]> {
  const responses: IChildResponse[] = [];

  try {
    for (const each of arg) {
      const res = await runChildProcessSplit(each);
      res.message = 'fulfilled';
      responses.push(res);
    }
  }
  catch (err) {
    responses.push(err as IChildResponse);
  }

  return new Promise<string[]>((resolve, reject) => {
    const isRejected = responses.some(each => each.isSuccess === false);
    if (isRejected) {
      reject(responses.map((each) => { return each.message }));
    }
    else {
      resolve(responses.map((each) => { return each.message }));
    }
  })
}

async function runChildProcessSplit(bookmark: IBookmark): Promise<IChildResponse> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://localhost:8080/api/split',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: JSON.stringify(bookmark),
  };

  const res: AxiosResponse<IChildResponse> = await axios(axiosConfig);
  const { isSuccess, message } = res.data;

  return new Promise<IChildResponse>((resolve, reject) => {
    if (isSuccess) {
      resolve({ isSuccess: true, message: message });
    }
    else {
      reject({ isSuccess: false, message: message });
    }
  });
}

export default { trySetSrc, trySplit };