upstream node {
  # fail_timeout=0 means we always retry an upstream even if it failed
  # to return a good HTTP response
  server localhost:9000 fail_timeout=0;
}

server {
    listen 80 default;
    #This matches peterlyons.com and *.peterlyons.com
    server_name .peterlyons.com;
    #This is essential so we can use the same configuration in production and staging
    server_name_in_redirect off;
    charset utf-8;
    access_log /home/plyons/projects/peter_lyons_web_site/var/log/nginx.access.log;
    error_log /home/plyons/projects/peter_lyons_web_site/var/log/nginx.error.log;

    location / {
        root /home/plyons/projects/peter_lyons_web_site/static;
        #Trailing slashes are verboten
        rewrite ^(.+)/$ http://$host$1 permanent;
        index index.html;
        try_files $uri $uri.html $uri/index.html @app;
    }

    location @app {
      rewrite /app(.*) $1 break;
      error_page 404 /error404.html;
      error_page 502 503 504 /error500.html;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_redirect off;
      proxy_pass http://node;
    }
}
