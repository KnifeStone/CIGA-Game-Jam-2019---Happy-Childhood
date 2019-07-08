import AudioUtils from "./AudioUtils";
import FirstAnim from "./first/FirstAnim";

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
export default class LayoutGamePass extends cc.Component {

    @property(cc.Node)
    layout:cc.Node = null

    onLoad () {
        this.node.removeFromParent()
        cc.game.addPersistRootNode(this.node)
        this.node.active = false
        let widget = this.node.getComponent(cc.Widget) as cc.Widget
        widget.horizontalCenter = 0
        widget.verticalCenter = 0
        cc.game.on("show-game-pass",this.show,this)
    }

    onDestroy(){
        cc.game.targetOff(this)
    }

    show(){
        this.node.active = true
        FirstAnim.Scale0t1(this.layout)
        AudioUtils.playGamePass()
    }

    onClickBack(){
        this.node.active = false
        cc.director.loadScene("Main")
    }

    onClickStage(){
        this.node.active = false
        cc.game.emit("show-stage")
    }


}

