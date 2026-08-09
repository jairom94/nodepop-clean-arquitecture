import http from 'node:http';
import app from './app.js';

const server = http.createServer(app);

const port = 3005;


server.listen(port,()=>{
  console.log(`Servidor escuchando en http://localhost:${port}`);
});