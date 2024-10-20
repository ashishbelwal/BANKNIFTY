/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/contracts', 
          destination: 'https://prices.algotest.in/contracts',
        },
        {
            source: '/api/option-chain-with-ltp', 
            destination: 'https://prices.algotest.in/option-chain-with-ltp', 
        },
      ];
    },
  };
  
  export default nextConfig;