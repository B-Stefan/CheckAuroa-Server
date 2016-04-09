import KPIndexDatabaseImporter from "./../services/database-services/KPIndexDatabaseImporter"


module.exports = function (server, callback) {
  console.log("boot");

  let databaseImporter = new KPIndexDatabaseImporter(server);

  setInterval(()=>{
    databaseImporter.startNewImport().then((results)=>{
      console.log("new results are there ")
    }).catch((err)=>{
      throw new Error(err)
    });
  },60 * 1000);


  databaseImporter.startNewImport().then((results)=>{
    console.log("Init results");
    callback();
  }).catch((err)=>{
    callback(new Error(err))
  });


};