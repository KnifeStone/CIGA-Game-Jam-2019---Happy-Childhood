import Config from "../src/Config";
import Box from "../prefabs/Box";
import BoxBean from "../src/BoxBean";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Edit extends cc.Component {

    @property(cc.Node)
    layoutMap:cc.Node = null

    @property(cc.Prefab)
    prefabBox:Box = null

    onLoad () {
        var self = this
        this.layoutMap.on(cc.Node.EventType.TOUCH_START,function(event){
            var v2 = self.layoutMap.convertToNodeSpace(event.getLocation())
            var x = v2.x / Config.unit
            x = Math.floor(x)
            var y = v2.y / Config.unit
            y = Math.floor(y)
            let vec = new cc.Vec2(x,y)
            console.log("坐标x:"+x+":y:"+y)
            self.newBox(cc.v2(x,y))
            self.updateMapView()
        }, this.layoutMap)

        //地图背景
        let datas = JSON.parse(JSON.stringify(Config.editData))
        for(let x = 0;x<Config.wNumber;x++){
            for(let y=0;y<Config.hNumber;y++){
                let value = datas[`${x}-${y}`]
                if(!value){
                    continue
                }
                let box = cc.instantiate(this.prefabBox)
                this.layoutMap.addChild(box)
                let boxJs = box.getComponent(box.name) as Box
                box.name = `${x}-${y}`
                let bean = new BoxBean(value.id,cc.v2(x,y))
                if(value.patrol){
                    bean.patrol = value.patrol
                }
                if(value.speed){
                    bean.speed = value.speed
                }
                boxJs.initData(bean)
            }
        }
          
    }

    onClickTest(){
        let children = this.layoutMap.children
        let datas = {}
        children.forEach(function(value){
            let bean = value.getComponent("Box").bean
            datas[value.name] = {
                id:bean.id
            }
            if(bean.patrol){
                datas[value.name].patrol = bean.patrol
            }
            if(bean.speed){
                datas[value.name].speed = bean.speed
            }
        })
        Config.editData = datas
        Config.stageDatas.push(datas)
        Config.nowStage = Config.stageDatas.length - 1
        console.log(JSON.stringify(datas))
        cc.director.loadScene("Game")
    }

    onClickBack(){
        cc.director.loadScene("Main")
    }

    onClickClear(){
        this.layoutMap.removeAllChildren()
    }

    newBox(pos:cc.Vec2){
        //是否存在
        let node = this.layoutMap.getChildByName(`${pos.x}-${pos.y}`)
        if(node){
            if(Config.checkedId == 0){
                node.removeFromParent()
            }else{
                cc.game.emit("show-toast","已存在")
            }
            return
        }
        let limit = this.checkLimit(Config.checkedId)
        switch(Config.checkedId){
            case 0:
                return
            case 1:
            case 2:
            case 206:
                if(limit>=1){
                    cc.game.emit("show-toast","这个家伙，不能放更多了")
                    return
                }
                break;
            case 204:
            case 205:
                if(limit>=2){
                    cc.game.emit("show-toast","这个家伙，不能放更多了")
                    return
                }
                break;
            case 10:
            case 11:
            case 12:
                if(limit>=3){
                    cc.game.emit("show-toast","这个家伙，不能放更多了")
                    return
                }
                break;
        }
        if(Config.checkedId == 0){
            return
        }
        let box = cc.instantiate(this.prefabBox)
        this.layoutMap.addChild(box)
        let boxJs = box.getComponent(box.name) as Box
        box.name = `${pos.x}-${pos.y}`
        let bean = new BoxBean(Config.checkedId,pos)
        boxJs.initData(bean)
        if(bean.checkEnemy()){
            bean.patrol = Config.checkPatrol
            bean.speed = Config.checkSpeed
        }
    }

    //刷新地图的显示规则
    updateMapView(){
        let children = this.layoutMap.children
        let datas = {}
        children.forEach(function(value){
            if(value.getComponent("Box").bean.id == 101){
                value.getComponent("Box").updateView()
            }
        })
    }

    //判断地图中已经存在的数量
    checkLimit(id:number):number{
        let limit = 0
        let children = this.layoutMap.children
        let datas = {}
        children.forEach(function(value){
            if(value.getComponent("Box").bean.id == id){
                limit ++ 
            }
        })
        return limit
    }

    
}
