export default {
  // ...existing config...
  server: {
    proxy: {
      '/pdf': 'http://localhost:3000',
      
    }
  }
}