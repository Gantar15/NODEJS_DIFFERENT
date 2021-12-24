const dgram = require('dgram');
const fs = require('fs');


const client = dgram.createSocket('udp4');

function sendData(msg){
  if(!msg) return;
  client.send(msg, 6300, 'localhost', (err) => {
    if (err) {
      client.close();
      client.disconnect();
      console.log(err.message)
    }
  });
}

const filePath = __dirname+'/data.txt';
fs.readFile(filePath, 'utf-8', (err, data) => {
  if(err) return;
  sendData(data);
})
fs.watch(filePath, () => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if(err) return;
    sendData(data);
  })
});