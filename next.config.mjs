// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: ['randomuser.me', 'source.unsplash.com', 'avatars.githubusercontent.com', 'turk.net', 'lh3.googleusercontent.com', 'graph.facebook.com', 'firebasestorage.googleapis.com', 'qph.cf2.quoracdn.net', 'images.rawpixel.com', 'e7.pngegg.com', 'images.unsplash.com', 'img.evbuc.com', 'www.google.com', 'www.adobe.com', 'static.vecteezy.com', 'powertofly.com', 'img.freepik.com', 'i.pinimg.com', 'www.gettyimages.ie', 'www.shutterstock.com', 'www.shutterstock.com'],
//         // unoptimized: true,
//     },
//     // distDir: 'build',
//     // output: 'export',
//     // trailingSlash: true,
//     experimental: {
//         missingSuspenseWithCSRBailout: false,
//     },

//     //   output: 'export',
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'randomuser.me',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'gitlab.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'turk.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'graph.facebook.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatar.iran.liara.run',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'qph.cf2.quoracdn.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.rawpixel.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'e7.pngegg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.evbuc.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.adobe.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'powertofly.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'med.gov.bz',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.gettyimages.ie',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.shutterstock.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.gitlab.com',
                port: '',
                pathname: '/**',
            },
            
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.freepik.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;