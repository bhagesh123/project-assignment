const http = require("http")
const url = require('url')
const { spawn } = require('child_process');

const hostname = "127.0.0.1"
const port = 5000;


let runPythonScript = (git_link) => {

  return new Promise((resolve, reject) => {
    const pythonProgram = spawn('python3', ["-W", "ignore", 'scraper.py', git_link]);

    pythonProgram.stdout.on('data', (data) => {
      resolve(data);
    })

    pythonProgram.stderr.on('data', (data) => {
      reject(data);
    })

  })
}


const server = http.createServer((request, response) => {
  let requestURL = url.parse(request.url, true);
  response.setHeader('Access-Control-Allow-Origin', "*")
  response.setHeader('Access-Control-Request-Method', "*")
  response.setHeader('Access-Control-Allow-Headers', "Origin, Content-Type");
  response.setHeader('Access-Control-Allow-Methods', "GET")

  if (requestURL.pathname === '/get_github_star' && request.method === "GET") {
    let query = requestURL.query
    let gitlink = query.git_link
    console.log("link: ",gitlink)
    runPythonScript(gitlink)
      .then((data) => {
        response.statusCode = 200;
        response.end(data);
      })
      .catch((err) => {
        console.log("error",err)
        response.statusCode = 422;
        response.end(err)
      })
  }
  else {
    // 404 error 
    response.statusCode = 404;
    response.end();
  }
})

server.listen(port, hostname, () => console.log(`listening on port: ${port}`));