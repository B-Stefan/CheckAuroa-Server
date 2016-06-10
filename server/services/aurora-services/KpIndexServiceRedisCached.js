import KpIndexService from "./KPIndexService"
import redis from "redis";

export default class KpIndexServiceRedisCached extends KpIndexService {


  redisPort = "";
  redisHost = "";
  redisPass = "";

  static redisClient;

  constructor(redisHost,redisPort, redisPass){
    super();
    this.redisPass = redisPass;
    this.redisHost = redisHost;
    this.redisPort= redisPort;

  }

  connectToRedisServer(){

    if(typeof KpIndexServiceRedisCached.redisClient == "undefined"){
      KpIndexServiceRedisCached.redisClient = new Promise((resolve,reject)=>{
        console.log("REDIS:newClient");
        let client  = redis.createClient({
          host: this.redisHost,
          port: this.redisPort,
          password: this.redisPass
        });
        client.on("error",function (err) {
            //console.log("REDIS:err");
            reject(err);
        });
        client.on("connect",function (){
            //console.log("REDIS:connect");
           resolve(client);
        });
      });
    }
    return KpIndexServiceRedisCached.redisClient;

  }

  getKpList(){

    return new Promise((resolve,reject)=>{

      this.connectToRedisServer().then((redisClient)=>{
        redisClient.get("kpList",(err,result)=>{
          //console.log("getResolve", result,err);
          if(err || result == null){
            if(err){
              super.getKpList().then((result)=>resolve(result)).catch(reject)
            }
            super.getKpList().then((kpIndexList)=>{
              //console.log("getKpList", kpIndexList);
              redisClient.setex("kpList",60 * 2,JSON.stringify(kpIndexList));
              resolve(kpIndexList)
            }).catch(reject)
          }else {
            return resolve(JSON.parse(result));
          }
        })
      }).catch(()=>{
        super.getKpList().then((result)=>resolve(result)).catch(reject)
      });

    })

  }
}