const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const app = function(req, res){

    const parsedUrl = url.parse(req.url,true);

    const method = req.method.toUpperCase();

    const queryString = parsedUrl.query;

    const headers = req.headers;

    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    const decoder = new StringDecoder('utf-8');
    const buffer ='';

    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();
//Choose the the Handlers 
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notfound;
        
        const data = {
            'trimmedPath' : trimmedPath,
            'queryString' : queryString,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

    chosenHandler(data, function(statusCode,payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200 ;
        payload = typeof(payload) == 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        res.writeHead(statusCode);
        res.end(payloadString);
        console.log('Returning this response: ',statusCode,payloadString);
    });
});
}
// Define handlers
   const handlers = {};

   handlers.sample = function(data,callback){
       //Callback HTTP status code
    callback(400,{'name': 'Sample handler'});
   };
   handlers.notfound = function(data,callback){
    callback(404);
   };

   const router = {
       'sample' : handlers.sample
   };


module.exports = app;