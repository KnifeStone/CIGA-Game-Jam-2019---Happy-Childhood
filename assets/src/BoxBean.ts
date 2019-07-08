import Config from "./Config";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class BoxBean{

    /**
     * 角色1 角色2 墙 101
     */
    id:number = 0
    key:cc.Vec2
    //单位大小
    unit:number = 0
    
    //分组
    group:string = "default"
    //定位
    zIndex:number = 0
    //存活
    alive:boolean = true
    //碰撞大小
    boxSize:number = 0
    //碰撞高度
    boxSizeH:number = 0

    //自定义参数
    //巡逻类型
    patrol:number = 0
    //速度
    speed:number = 0

    constructor(id:number,key:cc.Vec2){
        this.id = id
        this.key = key
        this.unit = Config.roles[id].unit
        this.group = Config.roles[id].group
        if(Config.roles[id].boxSize){
            this.boxSize = Config.roles[id].boxSize
        }else{
            this.boxSize = this.unit - 1
        }
        if(Config.roles[id].boxSizeH){
            this.boxSizeH = Config.roles[id].boxSizeH -1
        }
        if(Config.roles[id].speed){
            this.speed = Config.roles[id].speed
        }
       
        this.zIndex = Config.roles[id].zIndex
    }

    checkObstacle():boolean{
        return this.group == "obstacle"
    }

    checkEnemy():boolean{
        return this.group == "enemy"
    }

    checkHero():boolean{
        return this.id == 1 || this.id == 2
    }

    checkFood():boolean{
        return this.group == "food"
    }

    checkDevice():boolean{
        return this.group == "device"
    }

    //判断是否是豆子
    checkSoybean():boolean{
        return this.id >=200 && this.id <= 202
    }


}
