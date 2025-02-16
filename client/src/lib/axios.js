import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3700/api",

});

axiosInstance.interceptors.request.use(request => {
    const accessToken = localStorage.getItem("jwt")
    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});
// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});