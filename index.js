const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { maxHttpBufferSize: 1e4 });
const fs = require('fs')

app.use('/public', express.static('public'))

let rawdata = fs.readFileSync('./public/config.json');
let config = JSON.parse(rawdata);

var names = [];
data_folder = config.data_folder
buffer_folder = config.buffer_folder
sort_folder = config.sort_folder

fs.readdir(data_folder, (err, files) => {
    files.forEach(file => {
        names.push(file)
    });
});

app.get('/',function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
    var current_file;
    socket.on('start', () => {
        current_file = random();
        fs.rename(data_folder + '/' + current_file, buffer_folder + '/' + current_file, function (err) {
            if (err) console.log(err)
        })
        io.emit('file', current_file, socket.id);
    })

    socket.on('complete', (folder, file, id) => {
        if (socket.id == id)
        {
            fs.rename(buffer_folder + '/' + file, sort_folder + '/' + folder + '/' + file, function (err) {
                if (err) console.log(err)
            })
            io.emit('again', id);
        }
    })

    socket.on('disconnect', () => {
        fs.rename(buffer_folder + '/' + current_file, data_folder + '/' + current_file, function (err) {
            if (err) console.log(err)
        })
    })
})

function random()
{
    return names[Math.floor(Math.random()*names.length)]
}

async function start () {
    try {
      server.listen(3003, () => {
        console.log('listening on http://127.0.0.1:3003/');
      });   
      } catch (e) {
        console.log(e)
    }
}
  
start()