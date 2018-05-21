import KpIndexService from "./../aurora-services/KPIndexService"

export default class KPIndexDatabaseImporter {

  server;

  kpService;
  constructor(server){
    this.server = server;
    this.kpService = new KpIndexService();
  }

  /**
   * @private
   * @param KpIndexEntry
   */
  createOrUpdate(KpIndexEntry){
      return this.server.models.KpIndex.upsert(KpIndexEntry)
  }

  /**
   *
   * @param kpIndexResultList: Array<KpInformation>
   */
  mergeListIntoDatabase(kpIndexResultList){

    return kpIndexResultList.map((entry)=>this.createOrUpdate(entry))

  }

  startNewImport(){
    return this.kpService.getKpList().then((results)=>{

      return  Promise.all(this.mergeListIntoDatabase(results))
    })
  }




}
