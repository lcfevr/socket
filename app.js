/**
 * Created by Administrator on 4/20/2016.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server), //引入socket.io模块并绑定到服务器
    users=[];
app.use('/', express.static(__dirname + '/www'));
//app.use(express.static(path.join(__dirname,'/www')))
server.listen(80);

//socket部分
io.on('connection', function(socket) {
    //监听登陆事件
    socket.on('login', function(nickname) {
        if(users.indexOf(nickname)>-1){
            socket.emit('nickExisted')
        }else{
            socket.userIndex=users.length;//统计用户数量
            socket.nickname=nickname;
            users.push(nickname)
            socket.emit('loginSuccess')
            io.sockets.emit('system',nickname,users.length,'login')//像所有连接到服务器的客户端发送当前登录用户的昵称
        }
    })


    socket.on('postMsg',function(msg,color){
        console.log(color)
        socket.broadcast.emit('newMsg',socket.nickname,msg,color)
    })

    socket.on('img',function(img){
        socket.broadcast.emit('newImg',socket.nickname,img)
    })

    socket.on('disconnect',function(){
        users.splice(socket.userIndex,1)
        socket.broadcast.emit('system',socket.nickname,users.length,'logout')
    })
});






