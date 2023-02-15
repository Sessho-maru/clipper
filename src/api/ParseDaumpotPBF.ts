import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { PathLike } from "original-fs";
import { ChildResponse } from "typedefs/types";

async function tryParsePBF(arg: PathLike): Promise<ChildResponse> {
    try {
        const response: ChildResponse = await runParsePBF(arg);
        response.message = response.message.replace(/\*/g, '');
        response.message = response.message.replace(/[0-9]+=/g, '');
        return response;
    }
    catch (err) {
        return err as ChildResponse
    }
}

async function runParsePBF(path: PathLike): Promise<ChildResponse> {
    const axiosConfig: AxiosRequestConfig = {
        method: 'POST',
        url: `http://localhost:8080/api/parsePBF`,
        headers: {
            'Content-Type': 'text/plain'
        },
        data: path
    };

    const response: AxiosResponse<ChildResponse> = await axios(axiosConfig);
    return new Promise<ChildResponse>((resolve, reject) => {
        if (response.data.error) {
            reject(response.data);
        }
        else {
            resolve(response.data);
        }
    })
}

export default tryParsePBF;