const fs = require('fs')
const http = require('http');
let message = '';

const writeFile = (fileName,data) =>{
  fs.writeFile('./' + fileName, data, function(err, done){
    console.log('write operation');
    if (err) {
      console.log('err  >>>', err);
    } else {
      console.log('file create or write success ...!');
    }
  });
}
const readFile = (fileName, res) =>{
  console.log('read operation');
  fs.readFile('./' + fileName, "UTF-8", function(err, done){
    if (err) {
      console.log('err  >>>', err);
      res.end(`Error in file reading cause no '${fileName}' such file exist.`);
    } else {
      console.log('success ...!');
      res.end(JSON.stringify(done))
    }
  });
}
const renameFile = (fileName, newFileName) =>{
    console.log('rename operation');
    fs.rename('./' + fileName, './' + newFileName, function(err, done){
    if (err) {
      console.log('err  >>>', err);
    } else {
      console.log('success ...!');
    }
  });
}
const unlinkFile = (fileName, res) =>{
    console.log('delete operation');
    fs.unlink('./' + fileName, function(err, done){
    if (err) {
      console.log('err  >>>', err);
      res.end(`File you want to delete is not available...`)
    } else {
      console.log('success ...!');
      res.end(`File '${fileName}' removed successfully.`)
    }
  });
}

let port = 9091;
let server = http.createServer(function (req, res){
  console.log('client conneted to server');
  console.log('request method >>>', req.method);
  console.log('request url >>>', req.url);
  let urlData = req.url.split('/');
  console.log(urlData)
  switch(urlData[1]){
    case '':{
      res.end('Welcome to the File System. Use format /[operation(write, read, rename, remove)]/[fileName]/[data]');
      break;
    }
    case 'write':{
      message = 'Welcome to the File write. format /write/fileName/your text';
      if (urlData.length < 4) {
        res.end(message);
      }else{
        urlData[3] = decodeURI(urlData[3]);
        //urlData[3] = urlData[3].replace(/\W\d+/g, " ");
        writeFile(urlData[2], urlData[3]);
        res.end(`'${urlData[3]}' >> stored in file '${urlData[2]}'`);
      }
      break;
    }
    case 'read':{
      message = 'File read format invalid use. Format : /read/fileName';
      if(urlData.length < 3){
        res.end(message);
      } else {
        if (urlData[2] === ''){
          res.end(message);
        } else {
          readFile(urlData[2], res);
        }
      }
      break;
    }
    case 'rename':{
      message = 'Welcome to the File rename. Format : /rename/oldFilewName/newFileName';
      if (urlData.length < 4){
        res.end(message);
      } else {
        if (urlData[3] === ''){
          res.end(message);
        } else {
          renameFile(urlData[2], urlData[3], res);
          res.end(`file '${urlData[2]}' >> renamed as '${urlData[3]}'`);
        }
      }
      break;
    }
    case 'remove':{
      message = 'Welcome to the File remove. Format : /remove/fileName';
      if (urlData.length < 3){
        res.end(message);
      }else{
        if (urlData[2] === ''){
          res.end(message);
        } else {
          unlinkFile(urlData[2], res);
        }
      }
      break;
    }
    default:{
      res.end('Welcome to the File System');
      break;
    }
  }
});
server.listen(port, function(err, complete){
  if(err){
    console.log("err >>", err);
  }else{
    console.log("done", complete);
  }
})