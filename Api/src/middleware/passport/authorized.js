export default async function passportSocialAuthorized(req, res, next, socialType) {
  // TODO:

  res.setHeader('content-type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html>                  
      <head>
      <meta charset="utf-8">
      </head>
      <body>
        <script type="text/javascript">
          window.opener.authenticateCallback(${JSON.stringify({ token, user })});
          window.close();
        </script>
      </body>
    </html>
  `);
}
