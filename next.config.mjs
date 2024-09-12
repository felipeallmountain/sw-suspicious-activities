/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/i,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'glslify-loader',
        }
      ],
      exclude: /node_modules/,
    });

    return config;
  }
};

export default nextConfig;
