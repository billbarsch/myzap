//ecosystem.config.js
//
module.exports = {
  apps: [{
    name: 'MyZapFree',
    script: "./index.js",
    watch: true,
		watch_delay: 1000,
		ignore_watch : ["node_modules", "files-received"],
  }]
}