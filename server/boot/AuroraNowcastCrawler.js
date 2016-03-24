import NowCastAuroraService from "./../aurora-services/NowCastAuroraService"


module.exports = function (server) {
  console.log("boot nowCastAurora");

  let nowCastAurora = new NowCastAuroraService(server);

  function crawl() {
    console.time("nowcast");
    nowCastAurora.getList().then((result)=>{
      console.timeEnd("nowcast");
      server.models.AuroraNowcast.upsert(result);
      console.log("new prob results are there ", result.validAt.format());
    }).catch((err)=>{
      throw new Error(err)
    });
  }

  setInterval(crawl,50000);
  crawl();//init


};