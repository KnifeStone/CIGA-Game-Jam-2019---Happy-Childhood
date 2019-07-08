import Config from "../src/Config";
import Box from "../prefabs/Box";
import BoxBean from "../src/BoxBean";
import AudioUtils from "../src/AudioUtils";

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
export default class Game extends cc.Component {

    @property(cc.Prefab)
    prefabBox:cc.Prefab = null

    @property(cc.Node)
    layoutMap:cc.Node = null

    heroA:Box = null
    heroB:Box = null
    dataMaps:Array<Box> = null

    onLoad () {
        cc.game.emit("show-toast",`欢乐谷 - ${Config.nowStage+1}`,2)
       
        this.initListener()
        // manager.enabledDebugDraw = true;
        cc.game.on("tool-203",function(){
            if(this.heroA && this.heroB && this.heroA.bean.alive && this.heroA.bean.alive){
                let posA = cc.v2(this.heroA.node.x,this.heroA.node.y)
                let posB = cc.v2(this.heroB.node.x,this.heroB.node.y)
                this.heroA.actionDelivery(posB)
                this.heroB.actionDelivery(posA)
            }
        }.bind(this),this)
        cc.game.on("tool-204",function(selfJs:Box){
            if(this.heroA && this.heroB && this.heroA.bean.alive && this.heroA.bean.alive){
                let posA = cc.v2(this.heroA.node.x,this.heroA.node.y)
                let posB = cc.v2(this.heroB.node.x,this.heroB.node.y)
                this.heroA.actionDelivery(posB)
                this.heroB.actionDelivery(posA)
            }
        }.bind(this),this)
        cc.game.on("game-reset",function(){
            //重新开始游戏
            this.initData()
        }.bind(this),this)
        this.initData()
    }

    initData () {
        AudioUtils.playBgmGame()
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        Config.playing = true
        Config.soybeanNumber = 0
        this.heroA = null
        this.heroB = null
        this.dataMaps = []
        this.layoutMap.cleanup()
        this.layoutMap.removeAllChildren()
        let datas = Config.stageDatas[Config.nowStage]
        datas = JSON.parse(JSON.stringify(datas))
        // let datas = JSON.parse(JSON.stringify(Config.editData))
        for(let x = 0;x<Config.wNumber;x++){
            for(let y=0;y<Config.hNumber;y++){
                let value = datas[`${x}-${y}`]
                if(!value){
                    continue
                }
                let box = cc.instantiate(this.prefabBox)
                this.layoutMap.addChild(box)
                let boxJs = box.getComponent("Box") as Box
                box.name = `${x}-${y}`
                let bean = new BoxBean(value.id,cc.v2(x,y))
                if(value.patrol){
                    bean.patrol = value.patrol
                }
                if(value.speed){
                    bean.speed = value.speed
                }
                boxJs.initData(bean)
                if(value.id == 1){
                    this.heroA = boxJs
                }else if(value.id == 2){
                    this.heroB = boxJs
                }
                if(bean.checkSoybean()){
                    Config.soybeanNumber ++
                }
                this.dataMaps.push(boxJs)
            }
        }
        this.updateMapView()
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

    initListener(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    }

    onDestroy() {
        cc.game.targetOff(this)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            //玩家A的键盘
            case cc.macro.KEY.a:
                this.heroA.inputDown(0)
                break;
            case cc.macro.KEY.w:
                this.heroA.inputDown(1)
                break;
            case cc.macro.KEY.d:
                this.heroA.inputDown(2)
                break;
            case cc.macro.KEY.s:
                this.heroA.inputDown(3)
                break;
            //玩家B
            case cc.macro.KEY.left:
                this.heroB.inputDown(0)
                break;
            case cc.macro.KEY.up:
                this.heroB.inputDown(1)
                break;
            case cc.macro.KEY.right:
                this.heroB.inputDown(2)
                break;
            case cc.macro.KEY.down:
                this.heroB.inputDown(3)
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.heroA.inputUp(0)
                break;
            case cc.macro.KEY.w:
                this.heroA.inputUp(1)
                break;
            case cc.macro.KEY.d:
                this.heroA.inputUp(2)
                break;
            case cc.macro.KEY.s:
                this.heroA.inputUp(3)
                break;
                //玩家B
            case cc.macro.KEY.left:
                this.heroB.inputUp(0)
                break;
            case cc.macro.KEY.up:
                this.heroB.inputUp(1)
                break;
            case cc.macro.KEY.right:
                this.heroB.inputUp(2)
                break;
            case cc.macro.KEY.down:
                this.heroB.inputUp(3)
                break;
        }
    }

    update (dt) {
        // this.dataMaps.forEach(function(value:Box){
        //     value.updateFrame()
        // })
    }

}
