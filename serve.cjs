const {createPreviewServer}=require('./preview-server.cjs');
createPreviewServer().listen(4173,'127.0.0.1',()=>console.log('Local preview with security headers: http://127.0.0.1:4173'));
