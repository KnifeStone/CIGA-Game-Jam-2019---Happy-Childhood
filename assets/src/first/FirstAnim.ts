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
export default class FirstAnim extends cc.Component {

    @property(String)
    animName:string = ""

    onEnable(){
        this.node.stopAllActions()
        if(this.animName){
            this[this.animName+""]()
        }
    }

    //时隐时现
    fadeInOrOut(){
        let a1 = cc.fadeOut(0.8)
        let a2 = cc.delayTime(1)
        let a3 = cc.fadeIn(0.4)
        let a4 = cc.delayTime(1)
        let seq = cc.sequence(a1,a2,a3,a4)
        let repeat = cc.repeatForever(seq)
        this.node.runAction(repeat)
    }

    //传统弹窗
    scale0t1(){
        this.node.scale = 0
        let a1 = cc.scaleTo(1,1,1).easing(cc.easeBackOut())
        this.node.runAction(a1)
    }

    static Scale0t1(node:cc.Node){
        node.scale = 0
        let a1 = cc.scaleTo(1,1,1).easing(cc.easeBackOut())
        node.runAction(a1)
    }

}
