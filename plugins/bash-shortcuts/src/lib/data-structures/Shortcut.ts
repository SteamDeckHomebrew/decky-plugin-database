export class Shortcut {
    id:string;
    name:string;
    cmd:string;
    position:number;

    constructor(id:string, name:string, cmd:string, position:number) {
        this.id = id;
        this.name = name;
        this.cmd = cmd;
        this.position = position;
    }

    static fromJSON(json:any) {
        return new Shortcut(json.id, json.name, json.cmd, json.position);
    }
}