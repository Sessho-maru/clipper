import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Bookmark, ChildResponse } from "typedefs/types";

async function trySplit(arg: Bookmark[]): Promise<ChildResponse> {
  let response: ChildResponse = {} as ChildResponse; 

  try {
    for (const each of arg) {
      await runSplitProcess(each);
    }
  }
  catch (err) {
    response = err as ChildResponse;
  }

  return response;
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

  const response: AxiosResponse<ChildResponse> = await axios(axiosConfig);
  return new Promise<ChildResponse>((resolve, reject) => {
    if (response.data.error) {
      reject(response.data);
    }
    else {
      resolve(response.data);
    }
  });
}

export default trySplit;