# events.vot-er.org

This project provides an endpoint to track events on act.vot-er.org.

It's deployed on Cloudflare Workers.

Database interactions are handled through supabase-js.

For local testing, it can be handy to start a dev server in local mode, 
open a browser, then run this code in the JavaScript console:

```
fetch('/', {method: 'POST', body: '{"ref": "265", "type": "test", "destination": "test"}'});
```
