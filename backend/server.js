import jsonServer from 'json-server';
import cors from 'cors';

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(middlewares);
app.use(router);

app.listen(3000, () => {
  console.log('JSON Server running at http://localhost:3000');
});