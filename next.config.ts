/** @type {import('next').NextConfig} */

import type { Configuration as WebpackConfig, Module } from 'webpack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static optimization wherever possible
  output: 'export',
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
      },
    ],
    // Modern image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize for performance
  experimental: {
    // Enable modern optimizations
    typedRoutes: true,
    // Enable optimized bundling
    optimizeCss: true,
    // Use optimized JS bundling
    optimizePackageImports: [
      '@splinetool/react-spline',
      '@splinetool/runtime',
      'gsap',
      'react-icons'
    ],
  },
  
  // Webpack optimization
  webpack: (
    config: WebpackConfig,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ): WebpackConfig => {
    // Production optimizations
    if (!dev) {
      config.optimization = config.optimization || {};
      config.optimization.minimize = true;
      
      // Split chunks more aggressively
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: (module: Module): string => {
              // Get the name of the package
              const context = module.context || '';
              const matches = context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = matches ? matches[1] : 'vendor';
              
              // Group GSAP dependencies
              if (packageName.startsWith('gsap')) {
                return 'npm.gsap';
              }
              
              // Group Spline dependencies
              if (packageName.startsWith('@splinetool')) {
                return 'npm.splinetool';
              }
              
              // Return npm.[package-name] for other packages
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    
    // Use standard babel configuration for JavaScript/TypeScript files
    if (!isServer) {
      config.module = config.module || { rules: [] };
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }]
              ],
              plugins: [
                ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
              ],
            },
          },
        ],
        exclude: /node_modules/,
      });
    }
    
    return config;
  },
};

export default nextConfig;