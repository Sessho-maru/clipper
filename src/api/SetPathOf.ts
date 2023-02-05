import axios, { AxiosRequestConfig } from "axios";
import { PathKind } from "typedefs/types";
import { PathUtil } from '../utils/Utilities';

async function trySetPathOf(kind: PathKind, path: string): Promise<string> {
  const fullPath = await runSetPathOf(kind, path);
  const splitted = PathUtil.splitPath(fullPath);
  const rearThreeDirs = splitted.slice(splitted.length - 3);

  return `...\\${PathUtil.combineDirs(rearThreeDirs)}`;
}

async function runSetPathOf(kind: PathKind, path: string): Promise<string> {
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `http://localhost:8080/api/${(kind === 'src') ? 'setSrc' : 'setOuputDir'}`,
    headers: {
      'Content-Type': 'text/plain'
    },
    data: path,
  };

  const res = await axios(axiosConfig);
  return res.data.message;
}

export default trySetPathOf;