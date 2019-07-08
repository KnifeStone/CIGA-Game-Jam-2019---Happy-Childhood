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

const {ccclass, property} = cc._decorator;

@ccclass
export default class LayoutTool extends cc.Component {

    @property(cc.Node)
    item:cc.Node = null

    @property(cc.Node)
    toggleContainer:cc.Node = null

    onLoad(){
        this.item.parent = null
    }

    start () {
        Config.checkedId = 0
        let self = this
        cc.loader.loadResDir("texture",cc.SpriteFrame,function(err,textures:cc.SpriteFrame[]){
            console.log(err,textures)
            textures.forEach(function(values){
                self.newBox(values)
            })
            
        }.bind(this))
    }

    onChecked(event,tar){
        Config.checkedId = parseInt(event.node.name)
        console.log(Config.checkedId)
    }

    newBox(texture:cc.SpriteFrame){
        let node = cc.instantiate(this.item)
        node.name = texture.name
        node.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame = texture
        this.toggleContainer.addChild(node)
    }

    

    // update (dt) {}
}
