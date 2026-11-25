// GitHub Pages answers every missing address with /404.html. A missing page under /app/ is a coach link for someone who
// is not listed (never listed, paused or gone): it opens Coaching's start on the website, as the app does.
if (/^\/app\//.test(location.pathname)) location.replace("https://app.thefriendlytrader.com/coaching");
