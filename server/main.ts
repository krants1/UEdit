import {HTTPServer} from './httpServer';
import {userRouter, UserWSRouter} from './routes/userRouter';
import {Database} from './database';
import {ISequelizeConfig} from 'sequelize-typescript';
import {User} from './models/user.model';
import {RightType} from './models/right-types.model';
import {WebSocketServer} from './webSocketServer';

// HTTP Server
const httpServer = new HTTPServer('localhost', 3001);
httpServer.express.get('/', (req, res) => {
  res.render('index', {title: 'HTTPServer'});
});
httpServer.express.use('/api/users/', userRouter);
httpServer.setErrorRoutes();
httpServer.run();

// Web Socket Server
const webSocketServer = new WebSocketServer(8080);
const userWSRouter = new UserWSRouter(webSocketServer);

// Database
class DBConfig implements ISequelizeConfig {
  // ISequelizeConfig
  username = 'postgres';
  password = 'masterke';
  database = 'test';

  host = 'localhost';
  dialect = 'postgres';
  port = 5432;
}

const database = new Database(new DBConfig());
database.addModels([RightType, User]);

const sync = true;
function randomComment() {
  let text = '';
  const possible = ' ABCDEFGHIJKLMNOPQRSTUVWXY Zabcdefghijklmnopqrstuvwxyz 0123456789';

  for (let i = 0; i < Math.random() * 1000; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

if (sync) {
  const usersCount = 100;
  database.sync({force: true})
          .then(() => {
            console.log('Connection synced!');

            new RightType({name: 'Quest'}).save();
            new RightType({name: 'User'}).save();
            new RightType({name: 'Admin'}).save();
            for (let i = 1; i <= usersCount; i++) {
              new User({
                name: `Tom${i}`,
                secret: '12345',
                email: `tom${i}@mail.net`,
                comment: randomComment()
              }).save();
            }
          })
          .catch(err => console.log('syncError:', err));
} else {
  database.authenticate()
          .then(() => {
            console.log('Connected to DB');
            return;
          })
          .catch((err) => {
            console.log(err);
          });
}







