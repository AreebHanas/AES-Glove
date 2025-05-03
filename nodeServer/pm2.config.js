pm2Config = {
    apps: [
      {
        name: "server",
        script: "index.js",
        instances: 1,      
        exec_mode: "fork", 
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };

export default pm2Config;
  