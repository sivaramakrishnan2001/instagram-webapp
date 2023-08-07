import { APIsPath } from "./APIsPath.js";


export const GetRequest = async (URL, Data, Success, Error) => {
    try {
        const response = await APICALL(APIsPath.BaseUrl + URL, "GET", Data);
        Success(response);
    } catch (error) {
        Error(error);
    }
}

export const PostRequest = async (URL, Data, Success, Error) => {
    try {
        const response = await APICALL(APIsPath.BaseUrl + URL, "POST", Data);
        Success(response);
    } catch (error) {
        Error(error);
    }
}

export const DeleteRequest = async (URL, Req, Success, Error) => {
    try {
        const response = await APICALL(APIsPath.BaseUrl + URL, "DELETE", Req);
        Success(response);
    } catch (error) {
        Error(error);
    }
}

export const UpdateRequest = async (URL, Data, Success, Error) => {
    try {
        const response = await APICALL(APIsPath.BaseUrl + URL, "PUT", Data);
        Success(response);
    } catch (error) {
        Error(error);
    }
}


export const APICALL = async (URL, Method, Data) => {

    try {
        const response = await fetch(URL.trim(),
            {
                method: Method ? Method : "GET",
                headers: Data.headers ? Data.headers : { "Content-Type": "application/json", "token": JSON.parse(localStorage.getItem("token")) },
                body: Data.body ? JSON.stringify(Data.body) : null
            }
        );
        return response.json();

    } catch (error) {
        console.log("error",error);
    }
}