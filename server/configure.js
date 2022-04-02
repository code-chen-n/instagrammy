const path = require('path');
const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler')

const moment = require('moment');

const routes = require('./routes');

module.exports = function(app){

    moment.locale('zh-cn');   // 定义全局语言


    // app.engine('handlebars', exphbs.engine());
    app.engine('handlebars', exphbs.create({
        helpers:{
            timeago:function(timestamp){
                return moment(timestamp).startOf('minute').fromNow();
            },
        },
    }).engine);
    app.set('view engine', 'handlebars')

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser('secret-value'));
    app.use('/public/',express.static(path.join(__dirname, '../public')));    // express 自带的静态资源中间件 express.static，用于向客户端发送图片、CSS 等静态文件

    if(app.get('env') === 'development'){
        app.use(errorHandler());                      // 获取 env 变量来判断是否处于开发环境，如果是的话就添加 errorHandler 以便于调试代码
    }

    routes(app);
    return app;
}