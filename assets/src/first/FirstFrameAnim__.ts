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

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property
    text: string = 'hello';

    frameCount:number = 0
    frameIndex:number = 0

    update (dt) {
        this.frameCount ++
        if(this.frameCount >= 20){
            this.frameCount = 0
            if(this.frameIndex == 0){
                this.frameIndex = 1
            }else{
                this.frameIndex = 0
            }
            this.sprite.spriteFrame = cc.loader.getRes(`frame/${this.text}_${this.frameIndex}`,cc.SpriteFrame)
        }
    }
}
