import { useEffect } from 'react';
import api from '../api/axiosInstance';
import { useLoader } from '../context/LoaderContext';
import { useToast } from '../context/ToastContext';

const AxiosInterceptor = () => {
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();

    useEffect(() => {
        let requestCount = 0;

        const reqInterceptor = api.interceptors.request.use(
            (config) => {
                requestCount++;
                showLoader();
                return config;
            },
            (error) => {
                requestCount--;
                if (requestCount === 0) hideLoader();
                showToast('Request failed', 'error');
                return Promise.reject(error);
            }
        );

        const resInterceptor = api.interceptors.response.use(
            (response) => {
                requestCount--;
                if (requestCount === 0) hideLoader();
                return response;
            },
            (error) => {
                requestCount--;
                if (requestCount === 0) hideLoader();

                const message = error.response?.data?.message || 'Something went wrong';
                showToast(message, 'error');
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, [showLoader, hideLoader, showToast]);

    return null;
};

export default AxiosInterceptor;
