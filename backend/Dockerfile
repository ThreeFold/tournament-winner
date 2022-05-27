FROM denoland/deno:alpine
WORKDIR /app
COPY . ./
EXPOSE 8000
RUN apk --no-cache add curl
RUN deno cache main.ts
CMD ["run", "--allow-net", "--allow-env", "--unstable", "main.ts"]