import NowCastAuroraService from "./../services/aurora-services/NowCastAuroraService"

module.exports = function (server) {
  console.log("boot nowCastAurora");

  let nowCastAurora = new NowCastAuroraService(server);

  /**
   * general error handling
   * @param err
   */
  function errorHandling(err) {
    console.error(err);
    throw new Error(err);
  }

  /**
   * crawler function to get the matrix and save or update the db entry
   */
  function crawl() {
    console.time("nowcastCrawler");
    nowCastAurora.getList().then((result)=>{
      console.timeEnd("nowcastCrawler");
      console.time("startWriteNowcastIntoDatabase");

      // set up the result for the databse s
      result.id = result.validAt.unix();
      result.entries = JSON.stringify(result.entries);

      //Update or create the database entry
      server.models.AuroraNowcast.upsert(result).then((item)=>{

        if(item) console.log("new Nowcast item with the id: ", item.getId());
        console.timeEnd("startWriteNowcastIntoDatabase");

      }).catch(errorHandling);

    }).catch(errorHandling);
  };


  /**
   * The maximum number of AuroraNowcast entries. Each entry has 2mb approximately, so 2 * 100 => 200mb
   * @type {number}
   */

  let maxEntries = 20;

  /**
   * Destroy function to check if there are more then the maxEntries
   */
  function deleteOldestEntry() {

    server.models.AuroraNowcast.count().then((number)=>{
      if(number > maxEntries){
        server.models.AuroraNowcast.findOne({
          order: "id ASC"
        }).then((lastItem)=>{
          server.models.AuroraNowcast.destroyById(lastItem.getId()).then(()=>{
              console.log("deleteOldestEntry item destroyed ")
          }).catch(errorHandling)

        }).catch(errorHandling)
      }
    }).catch(errorHandling)
  }

  //setInterval(crawl,1000 * 60 * 2);
  //setInterval(deleteOldestEntry,1000 * 60 * 2);
  //crawl();//init
  //deleteOldestEntry()//init;


};