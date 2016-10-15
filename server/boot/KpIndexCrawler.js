import KPIndexDatabaseImporter from "./../services/database-services/KPIndexDatabaseImporter"
import KpIndexService from "./../services/aurora-services/KpIndexService"


module.exports = function (server, callback) {

  if(process.env["AURORA_MODE"] == "crawler"){
    console.log("boot crawler");

    let databaseImporter = new KPIndexDatabaseImporter(server);

    setInterval(()=>{
      databaseImporter.startNewImport().then((results)=>{
        console.log("new results are there ")
      }).catch((err)=>{
        throw new Error(err)
      });
    },60 * 1000 * 5);

    let kpService = new KpIndexService();

    kpService.getKpList().then((result_data)=>{
      databaseImporter.mergeListIntoDatabase(result_data)
    }).then(()=>{
      console.log("new init data  received ")
      callback()
    }).catch((err)=>{
      throw new Error(err)
    });


  }else {
    console.log("normal web server start ")
    callback()
  }



};