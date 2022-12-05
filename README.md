# events.vot-er.org

This project provides an endpoint to track events on act.vot-er.org.

It's deployed on Cloudflare Workers.

Database interactions are handled through supabase-js.

For testing, it can be handy to run this code in the JavaScript console:

```
fetch('https://events.vot-er.workers.dev/', {method: 'POST', mode: 'no-cors', body: '{"ref": "265", "type": "test", "destination": "test"}'});
```
