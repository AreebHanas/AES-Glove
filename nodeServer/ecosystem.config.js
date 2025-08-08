// nodeServer/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "my-server",
      script: "./index.js", // change this to your main server file
      watch: true,
      instances: 1, // or 'max' for clustering
      exec_mode: "fork", // or 'cluster' for load balancing
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
