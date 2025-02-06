import OSS from 'ali-oss';

const OSS_API_KEY = import.meta.env.VITE_OSS_ACCESS_KEY_ID;
const OSS_API_SECRET = import.meta.env.VITE_OSS_ACCESS_KEY_SECRET;


const client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: OSS_API_KEY,
    accessKeySecret: OSS_API_SECRET,
    bucket: 'growth-public',
    secure: true
});

export default client;
