ARG NODE_VERSION
FROM node:${NODE_VERSION}
WORKDIR /opt/plws/code
EXPOSE 9000 9001
ENV PLWS_PERS_HOST=0.0.0.0
ENV PLWS_PRO_HOST=0.0.0.0
ENV PATH=/usr/local/bin:/usr/bin:/bin:/opt/plws/code/node_modules/.bin
CMD ["./bin/start.sh"]
