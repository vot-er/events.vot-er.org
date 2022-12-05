import { UserAgent } from 'express-useragent';
import { createClient } from '@supabase/supabase-js';
import Toucan from 'toucan-js';

export default {
  async fetch(request, env, context) {
    const sentry = new Toucan({
      dsn: env.SENTRY_DSN,
      context,
      request,
      allowedHeaders: ['user-agent'],
      allowedSearchParams: /(.*)/,
    });
    try {
      if (request.method !== 'POST') { return Response.redirect('https://vot-er.org/'); }

      const supabase = createClient(env.SUPABASE_ENDPOINT, env.SUPABASE_PUBLIC_ANON_KEY);
      const eventData = await getEventData(request);
      const kitData = await getKitData(eventData, supabase);
      await createEvent(kitData, supabase);
      return new Response(undefined, { status: 200 });
    } catch(error) {
      sentry.captureException(error);
      return new Response('Sorry, there was an error.', { status: 500 });
    }
  }
}

async function getEventData(request) {
  const body = await request.json();
  const userAgent = request.headers.get('user-agent');
  const uaData = new UserAgent().parse(userAgent);

  return {
    ip: request.headers.get('CF-Connecting-IP'),
    code: body.ref?.toString?.().toLowerCase?.(),
    type: body.type,
    destination: body.destination,
    userAgent: userAgent,
    browser: uaData.browser,
    os: uaData.os,
    platform: uaData.platform,
    device: uaData.isMobile
      ? "mobile"
      : uaData.isDesktop
      ? "desktop"
      : uaData.isBot
      ? "bot"
      : null,
  };
}

async function getKitData(eventData, supabase) {
  const { code } = eventData;
  if (code) {
    const { data, error } = await supabase
      .from('kits')
      .select(`
        id,
        user (
          id,
          organization
        )
      `)
      .eq('code', code);
    const kit = data.pop();
    if (kit) {
      eventData.kit = kit.id;
      eventData.user = kit.user.id;
      eventData.organization = kit.user.organization;
    }
  }
  return eventData;
}

async function createEvent(kitData, supabase) {
  return supabase
    .from('events')
    .insert(kitData);
}
