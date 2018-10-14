import * as express from 'express';

const path = require('path');
const createError = require('http-errors');

export class HTTPServer {
    private _express: express = express();

    get express(): express {
        return this._express;
    }

    constructor(private hostname: string, private port: number) {
        this._express.use(express.json());
        this._express.use(express.urlencoded({extended: false}));
        // view engine setup
        this._express.set('views', path.join(__dirname, '../views'));
        this._express.set('view engine', 'pug');

        // allow access from client server
        this._express.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', false);
            // Pass to next layer of middleware
            next();
        });

    }

    public setErrorRoutes() {
        // catch 404 and forward to error handler
        this._express.use(function (req, res, next) {
            next(createError(404));
        });

        // error handler
        this._express.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    public run() {
        this._express.listen(this.port, this.hostname, () => {
            // connect to the DB
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}



