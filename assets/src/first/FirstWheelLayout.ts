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

    @property(cc.Label)
    label: cc.Label = null;

    texts:string[] = [
            "策划 - 光合作用的西行妖",
            "美术 - 钱安仪",
            "音效 - 丁一峰",
            "程序 - 江志锋",
    ]

    //多少帧刷新一次
    updateFrame:number = 180
    //下标
    index:number = 0

    nowFrame:number = 0

    onLoad(){
        this.action()
    }

    update (dt) {
        if(this.nowFrame>=this.updateFrame){
            this.nowFrame = 0
            this.index ++
            if(this.index >= this.texts.length){
                this.index = 0
            }
            this.action()
        }else{
            this.nowFrame ++
        }
    }

    action(){
        this.node.stopAllActions()
        this.label.string = this.texts[this.index]
        this.node.opacity = 0
        let a1 = cc.fadeIn(0.7)
        let a2 = cc.delayTime(1.5)
        let a3 = cc.fadeOut(0.8)
        let seq = cc.sequence(a1,a2,a3)
        this.node.runAction(seq)
    }

}
