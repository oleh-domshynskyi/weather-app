import { AppProps } from 'next/app';
import '@/styles/global.scss';
import axios from 'axios';

export default function MyApp({ Component, pageProps }: AppProps) {
  axios.interceptors.request.use(
    function (config) {
      config.params = {
        ...config.params,
        appid: `${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
  return <Component {...pageProps} />;
}
