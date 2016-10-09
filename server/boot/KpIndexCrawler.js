import KPIndexDatabaseImporter from "./../services/database-services/KPIndexDatabaseImporter"
import KpDstService from "./../services/aurora-services/KpServices/KpDstService"


module.exports = function (server, callback) {
  console.log("boot");

  let databaseImporter = new KPIndexDatabaseImporter(server);
  let kpDstService = new KpDstService();

  setInterval(()=>{
    databaseImporter.startNewImport().then((results)=>{
      console.log("new results are there ")
    }).catch((err)=>{
      throw new Error(err)
    });
  },60 * 1000 * 5);


  databaseImporter.startNewImport().then((results)=>{
    console.log("Init results");
  }).catch((err)=>{
  });

  setInterval(()=>{

    kpDstService.getKpIndexList().then((result_data)=>{

      databaseImporter.mergeListIntoDatabase(result_data)
    }).then(()=>{
      console.log("new dst received ")
    }).catch((err)=>{
      console.log(err)
    });
  },60*1000);

  
  callback();

};