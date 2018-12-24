import {HTTPServer} from './httpServer';
import {UserWSRouter} from './routes/userWsRouter';
import {UserHttpRouter} from './routes/userHttpRouter';
import {Database} from './database';
import {ISequelizeConfig} from 'sequelize-typescript';
import {User} from './models/user.model';
import {RightType} from './models/right-types.model';
import {WebSocketServer} from './webSocketServer';
import {Utils} from './utils';

// HTTP Server1
const httpServer = new HTTPServer('localhost', 8080);

// Web Socket Server
const webSocketServer = new WebSocketServer(httpServer);
webSocketServer.routes.push(new UserWSRouter(webSocketServer));

// HTTP Server2
httpServer.express.get('/', (req, res) => {
  res.render('index', {title: 'HTTPServer'});
});
httpServer.express.use('/api/users/', new UserHttpRouter(webSocketServer).getRouter());
httpServer.setErrorRoutes();
httpServer.run();

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

const reCreateData = true;
if (reCreateData) {
  const usersCount = 500;
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
                comment: Utils.randomComment()
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







