const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 냥! 💖 여기가 제일 중요해요! 주인님!
// Kider 파일에 있던 주소 대신에, index.html에 있던
// 주인님의 Apps Script 주소로 바꿔야 해요!
const GOOGLE_SCRIPT_PATH = '/macros/s/AKfycbzpv5ESZVnEzVkQTSJoSAyag5e2KPdxvWYNuNyliFu8eoI7FV90dlqjpr_0PaCv4pKLNw/exec';

app.use('/api', createProxyMiddleware({
    target: 'https://script.google.com',
    changeOrigin: true,
    pathRewrite: {
        // 🚨 이 부분이...
        // '^/api': '/macros/s/AKfycbymucHyMeANwDRi7xtl0IbXppo4PJt8DgWmsAK4g-KMBKuZ6veqCZymTy2GpVqPVLX5/exec'
        // ✨ 이렇게 바뀌어야 해요! 냥!
        '^/api': GOOGLE_SCRIPT_PATH
    },
    onProxyReq: (proxyReq, req, res) => {
        // 원본 URL의 쿼리 문자열을 유지
        const originalUrl = new URL(req.url, `http://${req.headers.host}`);
        
        // 🚨 이 부분도...
        // proxyReq.path = '/macros/s/AKfycbymucHyMeANwDRi7xtl0IbXppo4PJt8DgWmsAK4g-KMBKuZ6veqCZymTy2GpVqPVLX5/exec' + originalUrl.search;
        // ✨ 이렇게 바뀌어야 해요! 냥!
        proxyReq.path = GOOGLE_SCRIPT_PATH + originalUrl.search;
        
        console.log('Proxying request to:', proxyReq.path);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('Received response:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error: ' + err.message);
    }
}));


app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});