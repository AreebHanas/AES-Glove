pm2Config = {
    apps: [
      {
        name: "client",
        script: "node_modules/serve/bin/serve.js",
        args: "-s build -l 3000",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };

export default pm2Config;