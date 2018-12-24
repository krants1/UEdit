import {Router} from 'express';
import {RightType} from '../models/right-types.model';
import {User} from '../models/user.model';
import {WebSocketServer} from '../webSocketServer';

interface HttpRouter {
  router: Router;
  wss?: WebSocketServer;
  wssBroadcast?(event: string, data: any);
}

export class UserHttpRouter implements HttpRouter {
  router: Router;
  wss?: WebSocketServer;

  constructor(webSocketServer: WebSocketServer = null) {
    this.router = Router();
    this.wss = webSocketServer;
    this.subscrible();
  }

  getRouter(): Router {
    return this.router;
  }

  wssBroadcast(event: string, data: any) {
    if (this.wss) {
      this.wss.broadcast(event, data);
    }
  }

  subscrible() {
    this.router.get('/right-types', (req, res) => {
      RightType
        .findAll()
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500)
                    .json(err);
        });
    });

    this.router.get('/', (req, res) => {
      const id: number = req.query['id'];
      if (id) {
        User
          .findOne({include: [RightType], where: {id: id}})
          .then((data) => {
            return res.json(data);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500)
                      .json(err);
          });
      } else {
        if (req.query['limit'] && req.query['offset']) {
          const limit: number = req.query['limit'];
          const offset: number = req.query['offset'];
          let sort_order: string = req.query['sort_order'];
          sort_order = sort_order ? sort_order : 'id';
          let sort_direction: string = req.query['sort_direction'];
          sort_direction = sort_direction ? sort_direction.toUpperCase() : 'ASC';

          User.findAndCountAll()
              .then((dataAll) => {
                User
                  .findAll({
                    include: [RightType],
                    order: [[sort_order, sort_direction]],
                    limit: limit,
                    offset: offset
                  })
                  .then((users) => {
                    return res.json({'items': users, 'total_count': dataAll.count});
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(500)
                              .json(err);
                  });
              });

        } else {
          User
            .findAll({include: [RightType], order: ['id']})
            .then((data) => {
              return res.json(data);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500)
                        .json(err);
            });
        }
      }
    });

    this.router.put('/', (req, res) => {
      const id: number = req.query['id'];
      if (!id || id <= 0) {
        res.status(400)
           .send();
      } else {
        User.update(req.body, {where: {id: id}})
            .then((data) => {
              this.wssBroadcast('user.event.edit', id);
              return res.json(data);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500)
                        .json(err);
            });
      }
    });

    this.router.post('/', (req, res) => {
      User.create(req.body)
          .then((user) => {
            this.wssBroadcast('user.event.add', user['id']);
            return res.json(user);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500)
                      .json(err);
          });
    });

    this.router.delete('/', (req, res) => {
      const id: number = parseInt(req.query['id'], 0);
      if (!id || id <= 0) {
        res.status(400)
           .send();
      } else {
        User.destroy({where: {id: id}})
            .then((data) => {
              this.wssBroadcast('user.event.delete', id);
              return res.json(id);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500)
                        .json(err);
            });
      }
    });
  }
}
