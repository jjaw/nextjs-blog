/* 
  Createing API Routes
  Creating function inside 'pages/api' directory
  that has the following format.

  // req = HTTP incoming message, res = HTTP server response
  export default function handler(req, res) {
    // ...
  }
*/

export default function handler(req, res) {
  res.status(200).json({ text: 'Hello '});
}
