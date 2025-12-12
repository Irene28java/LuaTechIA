import globalTunnel from "global-tunnel-ng";

if (process.env.HTTP_PROXY) {
  globalTunnel.initialize({
    host: process.env.HTTP_PROXY.replace("http://", "").split(":")[0],
    port: process.env.HTTP_PROXY.split(":").pop(),
    sockets: 50
  });

  console.log("🌍 Proxy activado para todas las requests externas.");
}
