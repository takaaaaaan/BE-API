/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // 클라이언트 번들에서 'aws4'와 'mongodb-client-encryption'을 제외
      config.resolve.fallback = {
        "aws4": false,
        "mongodb-client-encryption": false
      };
  
      return config;
    },
  };
  
  export default nextConfig;
  