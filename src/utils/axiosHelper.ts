import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { LocalStorageHelper } from "./localStorageHelper";

export default class AxiosHelper {
	axiosInstance: AxiosInstance;
	constructor() {
		// Create an Axios instance with specific configurations
		this.axiosInstance = axios.create({
			timeout: 900000, // 15 minutes
			maxRedirects: 10,
			maxContentLength: Infinity,
		});
	}

	/**
	 * Make a GET request to the specified endpoint.
	 * @param baseUrl - The base URL for the API.
	 * @param endPoint - The specific endpoint to call.
	 * @param token - Optional authorization token.
	 * @param headers - Optional headers in the form of key-value pairs (object).
	 * @returns A promise that resolves to the response string.
	 */
	async makeGetRequest(baseUrl: string, endPoint: string, token: string = "", headers: Record<string, string> | null = null): Promise<AxiosResponse<string>> {
		const config: AxiosRequestConfig = {
			baseURL: baseUrl,
			timeout: 900000, // 15 minutes
			headers: headers ? { ...headers } : {},
		};
		this.axiosInstance = axios.create({
			timeout: 900000, // 15 minutes
			maxRedirects: 10,
			maxContentLength: Infinity,
		});

		// Add token if provided
		if (token) {
			config.headers!["Authorization"] = `Bearer ${token}`;
		}

		try {
			const response: AxiosResponse<string> = await this.axiosInstance.get(endPoint, config);
			return response;
		} catch (error) {
			console.error("Error in makeGetRequest:", error);
			return { data: null, status: 500, statusText: "Error while calling API" } as AxiosResponse;
		}
	}

	/**
	 * Make a POST request to the specified endpoint.
	 * @param baseUrl - The base URL for the API.
	 * @param endPoint - The specific endpoint to call.
	 * @param apiRequestData - The object to send in the body of the request.
	 * @param token - Optional authorization token.
	 * @param headers - Optional headers in the form of key-value pairs (object).
	 * @returns A promise that resolves to the response string.
	 */
	async makePostRequest(baseUrl: string, endPoint: string, apiRequestData: unknown, token: string = "", type: string= "", headers: Record<string, string> | null = null): Promise< AxiosResponse<string> > {
		const config: AxiosRequestConfig = {
			baseURL: baseUrl,
			timeout: 900000, // 15 minutes
			headers: {
				"Content-Type": "application/json",
				type: !type? LocalStorageHelper.getRequestType() : type,
				...(headers || {}),
			},
		};
		this.axiosInstance = axios.create({
			timeout: 900000, // 15 minutes
			maxContentLength: Infinity,
		});
		// Add token if provided
		if (token !== "") {
			config.headers!["Authorization"] = `Bearer ${token}`;
		}
		try {
			const response: AxiosResponse<string> = await this.axiosInstance.post(endPoint, apiRequestData, config);
			return response;
		} catch (error) {
			console.error("Error in makeGetRequest:", error);
			return { data: null, status: 500, statusText: "Error while calling API" } as AxiosResponse;
		}
	}
}
