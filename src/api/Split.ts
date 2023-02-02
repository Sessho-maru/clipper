import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Bookmark, ChildResponse } from "typedefs/types";

async function trySplit(arg: Bookmark[]): Promise<ChildResponse> {
  let res: ChildResponse = {} as ChildResponse; 

  try {
    for (const each of arg) {
      await runSplitProcess(each);
    }
  }
  catch (err) {
    res = err as ChildResponse;
  }

  return new Promise<ChildResponse>((resolve, reject) => {
    if (res.error) {
      reject(res);
    }
    else {
      resolve({ error: null, message: 'OK' });
    }
  })
}
async function runSplitProcess(bookmark: Bookmark): Promise<ChildResponse> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://localhost:8080/api/split',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: JSON.stringify(bookmark),
  };

  const res: AxiosResponse<ChildResponse> = await axios(axiosConfig);
  return new Promise<ChildResponse>((resolve, reject) => {
    if (res.data.error) {
      reject(res.data);
    }
    else {
      resolve(res.data);
    }
  });
}

export default trySplit;