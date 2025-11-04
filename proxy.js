const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const GOOGLE_SCRIPT_PATH = '/macros/s/AKfycbzpv5ESZVnEzVkQTSJoSAyag5e2KPdxvWYNuNyliFu8eoI7FV90dlqjpr_0PaCv4pKLNw/exec';

app.use('/api', createProxyMiddleware({
    target: 'https://script.google.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': GOOGLE_SCRIPT_PATH
    },
    onProxyReq: (proxyReq, req, res) => {
        const originalUrl = new URL(req.url, `http://${req.headers.host}`);
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
