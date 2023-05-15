import { HttpApiServices } from "./HttpApiServices";

export class MeetServices extends HttpApiServices {

    baseUrl = '/meet';

    async getMeets(){
        return await this.get(this.baseUrl);
    }

    async getMeetById(id: string){
        console.log('ESTOU AQUI  getMeetById =>',this.baseUrl+'/'+id)
        return await this.get(this.baseUrl+'/'+id);
    }

    async getMeetObjectsById(id: string){
        console.log('ESTOU AQUI getMeetObjectsById =>',this.baseUrl+'/object/'+id)
        return await this.get(this.baseUrl+'/object/'+id);
    }

    async deleteMeet(id: string){
        return await this.delete(this.baseUrl+'/'+id);
    }

    async createMeet(body: any){
        return await this.post(this.baseUrl, body);
    }

    async updateMeet(body: any, id: string){
        return await this.put(this.baseUrl+'/'+id, body);
    }
}