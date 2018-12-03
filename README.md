NodeJs learning project. Nothing fancy here.

url-shortener will accept (POST) json object in the following format at url/shorten and will redirect to a found shortened url on url/<string>

{ 
  "target": "http://google.de",
  "shortened": "g"
}