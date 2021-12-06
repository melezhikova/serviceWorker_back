const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const cors = require('koa2-cors');
const faker = require('faker');
slow = require('koa-slow');

class NewsController {
  constructor() {
    this.news = [];
  }

  getNews() {
    return this.news;
  }
}

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(slow({
  url: /\allNews$/i,
        delay: 3000
}))

const newsCtrl = new NewsController();
newsCtrl.news = [
  {
    image: faker.image.image(),
    created: new Date(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  },
  {
    image: faker.image.image(),
    created: new Date(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  },
  {
    image: faker.image.image(),
    created: new Date(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  },
  {
    image: faker.image.image(),
    created: new Date(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  },
];

app.use(async (ctx) => {
  let method;
  console.log(ctx.request.query);
  // обратите внимание, что метод (это наш параметр а не HTTP метод) в зависимости от http
  // метода передается по разному либо лежит в ctx.request.query либо в ctx.request.body
  if (ctx.request.method === 'GET') ({ method, id } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method, object } = ctx.request.body);
  // В итоге, нам нужно правильно установить ctx.response.status и ctx.response.body
  // ctx.response = {status: string, body: string}

  ctx.response.status = 200;
  switch (method) {
    case 'allNews': ctx.response.body = newsCtrl.getNews();
      break;
    
    default:
      ctx.response.status = 400;
      ctx.response.body = `Unknown method '${method}' in request parameters`;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, (error) => {
  if (error) {
    console.log('Error occured:', error);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});

