import OSS from 'ali-oss';

const getSTSToken = async (): Promise<{
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
}> => {
    const response = await fetch('/api/sts/token');
    if (!response.ok) {
        throw new Error('Failed to fetch STS token');
    }
    return response.json();
};

const ossClient = async () => {
    try {
        const {accessKeyId, accessKeySecret, securityToken, expiration} = await getSTSToken();
        // Convert expiration to Date object
        const expirationDate = new Date(expiration);
        // Calculate the interval for refreshing the token
        const now = new Date();
        const interval = expirationDate.getTime() - now.getTime() - 60 * 1000; // Refresh 1 minute before expiration

        // noinspection JSUnusedGlobalSymbols
        return new OSS({
            region: 'oss-cn-shanghai',
            accessKeyId,
            accessKeySecret,
            stsToken: securityToken,
            bucket: 'growth-public',
            secure: true,
            refreshSTSToken: async () => {
                const newToken = await getSTSToken();
                return {
                    accessKeyId: newToken.accessKeyId,
                    accessKeySecret: newToken.accessKeySecret,
                    stsToken: newToken.securityToken,
                    expiration: new Date(newToken.expiration),
                };
            },
            refreshSTSTokenInterval: interval,
        });
    } catch (error) {
        console.error('Error initializing OSS client:', error);
        throw error;
    }
};

export default ossClient;
