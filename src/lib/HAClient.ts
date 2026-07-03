import axios, { AxiosInstance } from "axios";

export default class HAClient {

    private readonly client: AxiosInstance;

    constructor(
        url: string,
        token: string,
        timeout = 5000
    ) {

        this.client = axios.create({

            baseURL: url,

            timeout,

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type": "application/json"

            }

        });

    }

}
