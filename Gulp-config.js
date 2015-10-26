import fs from "fs";
const file = 'aurora-api/swagger.json';
const swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
const data = {
    "spec": swagger
};


export default {
    swaggerPostData:  data
}