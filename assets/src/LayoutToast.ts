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
export default class LayoutToast extends cc.Component {

    @property(cc.Node)
    layout:cc.Node = null

    @property(cc.Node)
    container:cc.Node = null

    onLoad () {
        this.node.removeFromParent()
        cc.game.addPersistRootNode(this.node)
        this.layout.active = false
        let widget = this.node.getComponent(cc.Widget) as cc.Widget
        widget.horizontalCenter = 0
        widget.verticalCenter = 0
        cc.game.on("show-toast",this.toast,this)
    }

    onDestroy(){
        cc.game.targetOff(this)
    }

    toast(msg:string,duration:number){
        //同时只能存在一个toast
        this.container.cleanup()
        this.container.removeAllChildren()
        console.log("toast:",msg,duration)
        let layout = cc.instantiate(this.layout)
        layout.active = true
        layout.scale = 0
        let a1 = cc.scaleTo(0.1,1,1)
        let a2 = cc.fadeOut(0.1)
        let seq = cc.sequence(a1,cc.delayTime(duration?duration:1),a2,cc.callFunc(function(){
            layout.removeFromParent()
            layout.destroy()
        }.bind(layout)))
        layout.runAction(seq)
        layout.getChildByName("LabelTitle").getComponent(cc.Label).string = `${msg}`
        this.container.addChild(layout)
    }

}

