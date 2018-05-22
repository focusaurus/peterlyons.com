ARG NODE_VERSION
FROM mhart/alpine-node:${NODE_VERSION}
RUN apk --no-cache add bash git
WORKDIR /opt/plws/code
EXPOSE 9000 9001
ENV PLWS_PERS_HOST=0.0.0.0
ENV PLWS_PRO_HOST=0.0.0.0
ENV PATH=/usr/bin:/bin:/opt/node_modules/.bin
CMD ["./bin/start.sh"]
