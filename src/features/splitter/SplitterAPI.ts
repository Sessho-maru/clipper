import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IBookmark, IChildResponse } from "./define";

// #region parsing injected text file to IBookmark[]

async function tryParseTextInjection(path: string): Promise<IChildResponse> {
  try {
    const res = await runParseTextInjectionProcess(path);
    res.message = res.message.replace(/\*/g, '');
    res.message = res.message.replace(/[0-9]+=/g, '');
    return res;
  }
  catch (err) {
    return err as IChildResponse;
  }
}
async function runParseTextInjectionProcess(path: string): Promise<IChildResponse> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://localhost:8080/api/parseInjection',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: path,
  }

  const res: AxiosResponse<IChildResponse> = await axios(axiosConfig);
  const { isSuccess, message } = res.data;

  return new Promise<IChildResponse>((resolve, reject) => {
    if (isSuccess) {
      resolve({ isSuccess: true, message: message });
    }
    else {
      reject({ isSuccess: false, message: message });
    }
  })
}

// #endregion

// #region set source video path

async function trySetPathOf(kind: 'src' | 'output', path: string): Promise<string> {
  const fullPath = await runSetPathOf(kind, path);

  return new Promise<string>((resolve) => {
    resolve(fullPath);
  })
}
async function runSetPathOf(kind: 'src' | 'output', path: string): Promise<string> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `http://localhost:8080/api/${(kind === 'src') ? 'setSrc' : 'setOuputPath'}`,
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

// #endregion 

// #region set output path



// #endretion

// #region execute ffmpeg splitting

async function trySplit(arg: IBookmark[]): Promise<IChildResponse[]> {
  const responses: IChildResponse[] = [];

  try {
    for (const each of arg) {
      const res = await runSplitProcess(each);
      res.message = 'fulfilled';
      responses.push(res);
    }
  }
  catch (err) {
    responses.push(err as IChildResponse);
  }

  return new Promise<IChildResponse[]>((resolve, reject) => {
    const isRejected = responses.some(each => each.isSuccess === false);
    if (isRejected) {
      reject(responses);
    }
    else {
      resolve(responses);
    }
  })
}
async function runSplitProcess(bookmark: IBookmark): Promise<IChildResponse> {
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

// #endregion

export default { trySetPathOf, trySplit, tryParseTextInjection };