import {Router} from 'express';
import {User} from '../models/user.model';
import {RightType} from '../models/right-types.model';
import {WebSocketRouter} from '../webSocketServer';

export const userRouter = Router();

export class UserWSRouter extends WebSocketRouter {
  init() {
    this.ownerWSServer.on('right-types')
        .subscribe((mess) => {
          RightType
            .findAll()
            .then((data) => {
              this.ownerWSServer.send(mess.conn, 'right-types', data);
            })
            .catch((err) => {
              console.log(err);
              this.ownerWSServer.sendError(mess.conn, 'right-types', err);
            });
        });
    this.ownerWSServer.on('user.get')
        .subscribe((mess) => {
          const id: number = mess.data;
          User
            .findOne({include: [RightType], where: {id: id}})
            .then((data) => {
              this.ownerWSServer.send(mess.conn, 'user.get', data);
            })
            .catch((err) => {
              console.log(err);
              this.ownerWSServer.sendError(mess.conn, 'user.get', err);
            });
        });
    this.ownerWSServer.on('user.edit')
        .subscribe((mess) => {
          const id: number = mess.data['id'];
          if (!id || id <= 0) {
            this.ownerWSServer.sendError(mess.conn, 'user.edit', 'User Not Found');
          } else {
            User.update(mess.data, {where: {id: id}})
                .then((data) => {
                  this.ownerWSServer.send(mess.conn, 'user.edit', data);
                  this.ownerWSServer.broadcast('user.event.edit', id);
                })
                .catch((err) => {
                  console.log(err);
                  this.ownerWSServer.sendError(mess.conn, 'user.edit', err);
                });
          }
        });
    this.ownerWSServer.on('user.add')
        .subscribe((mess) => {
          User.create(mess.data)
              .then((user) => {
                this.ownerWSServer.send(mess.conn, 'user.add', user);
                this.ownerWSServer.broadcast('user.event.add', user['id']);
              })
              .catch((err) => {
                console.log(err);
                this.ownerWSServer.sendError(mess.conn, 'user.add', err);
              });
        });
    this.ownerWSServer.on('user.delete')
        .subscribe((mess) => {
          const id: number = mess.data;
          if (!id || id <= 0) {
            this.ownerWSServer.sendError(mess.conn, 'user.delete', 'User Not Found');
          } else {
            User.destroy({where: {id: id}})
                .then((data) => {
                  this.ownerWSServer.send(mess.conn, 'user.delete', data);
                  this.ownerWSServer.broadcast('user.event.delete', id);
                })
                .catch((err) => {
                  console.log(err);
                  this.ownerWSServer.sendError(mess.conn, 'user.delete', err);
                });
          }
        });
    this.ownerWSServer.on('users.get')
        .subscribe((mess) => {
          User
            .findAll({include: [RightType], order: ['id']})
            .then((data) => {
              this.ownerWSServer.send(mess.conn, 'users.get', data);
            })
            .catch((err) => {
              console.log(err);
              this.ownerWSServer.sendError(mess.conn, 'users.get', err);
            });
        });
  }
}

userRouter.get('/right-types', (req, res) => {
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

userRouter.get('/', (req, res) => {
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
});

userRouter.put('/', (req, res) => {
  const id: number = req.query['id'];
  if (!id || id <= 0) {
    res.status(400)
       .send();
  } else {
    User.update(req.body, {where: {id: id}})
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500)
                    .json(err);
        });
  }
});

userRouter.post('/', (req, res) => {
  User.create(req.body)
      .then((user) => {
        return res.json(user);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500)
                  .json(err);
      });
});

userRouter.delete('/', (req, res) => {
  const id: number = req.query['id'];
  if (!id || id <= 0) {
    res.status(400)
       .send();
  } else {
    User.destroy({where: {id: id}})
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500)
                    .json(err);
        });
  }
});
