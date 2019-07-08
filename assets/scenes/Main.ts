import Config from "../src/Config";
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
export default class NewClass extends cc.Component {

    @property(cc.Node)
    nodeHome:cc.Node = null

    @property(cc.Node)
    btnStart: cc.Node = null

    @property(cc.Node)
    btnCreate: cc.Node = null

    onLoad () {
        cc.loader.loadResDir("",function(){
            //加载成功
            AudioUtils.playBgmMain()
            this.showBtn()
        }.bind(this))
        Config.playing = false
        Config.checkPatrol = 0   
        Config.checkSpeed = 0
        Config.checkedId = 0   
        this.btnStart.active = false  
        this.btnCreate.active = false 
        this.nodeHome.y = 0
    }

    onClickStart(){
        // cc.director.loadScene("Game")
        cc.game.emit("show-stage")
    }

    onClickEdit(){
        cc.director.loadScene("Edit")
    }

    showBtn(){
        let a0 = cc.moveTo(0.3,this.nodeHome.x,130)
        this.nodeHome.runAction(a0)

        this.btnStart.active = true  
        this.btnStart.scale = 0
        let a1 = cc.scaleTo(0.6,1,1)
        this.btnStart.runAction(a1)

        this.btnCreate.active = true 
        this.btnCreate.opacity = 0
        let a2 = cc.fadeTo(0.8,255)
        this.btnCreate.runAction(a2)
    }
    
}
