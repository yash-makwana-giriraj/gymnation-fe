import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME && process.env.NEXT_PUBLIC_IMAGE_PROTOCOL
            ? [
                {
                    protocol: process.env.NEXT_PUBLIC_IMAGE_PROTOCOL as 'http' | 'https',
                    hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME,
                }
            ]
            : [],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);