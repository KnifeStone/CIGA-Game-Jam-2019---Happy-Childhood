import BoxBean from "../src/BoxBean";
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
export default class Box extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    private bean:BoxBean = null
    //方向  1激活 0取消 左上右下
    ds:number[] = [0,0,0,0]
    //上一次的方向
    firstD:number = -1

    //暂停的帧数
    pauseFrame:number = 0
    //不可用帧数
    disabledFrame:number = 0
    //开门进度,第一个点击的人
    openDoorName:string = ""

    initData(bean:BoxBean){
        this.bean = bean
        this.node.group = bean.group
        this.node.width = bean.unit
        this.node.height = bean.unit
        this.node.zIndex = bean.zIndex
        let boxC = this.node.getComponent(cc.BoxCollider) as cc.BoxCollider
        boxC.size = cc.size(bean.boxSize,bean.boxSizeH?bean.boxSizeH:bean.boxSize)
        this.updatePosition()
        this.updateView()
        if(bean.checkEnemy()){
            cc.game.on("pause-frame",function(id,pauseFrame){
                if(this.bean.id == id){
                    this.pauseFrame = pauseFrame
                }
            }.bind(this),this)
        }
        if(this.bean.id == 204){
            this.rotateRepeat()
        }else if(this.bean.id == 1 || this.bean.id == 2){
            let node = this.node.getChildByName("bg")
            this.node.active = true
            node.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("bg/"+this.bean.id,cc.SpriteFrame)
            this.heroBill(node)
        }
    }

    updatePosition(){
        this.node.x = this.bean.key.x*Config.unit+Config.unit/2
        this.node.y = this.bean.key.y*Config.unit+Config.unit/2
    }

    onDestroy(){
        cc.game.targetOff(this)
    }

    clearInput(){
        this.ds[0] = 0
        this.ds[1] = 0
        this.ds[2] = 0
        this.ds[3] = 0
    }

    inputDown(index:number){
        this.clearInput()
        //同时只接受一个输入
        this.ds[index] = 1
    }
    inputUp(index:number){
        this.ds[index] = 0
    }

    updateView(){
        if(this.bean.id == 101){
            //判断左上右下四个方向是否有墙，没有就显示，有就不显示
            let parent = this.node.parent
            let sp
            let none
            let fun = function(node,sp){
                if(node && none.getComponent("Box").bean.id == 101){
                    sp.active = false
                }else{
                    sp.active = true
                    sp.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("texture/101",cc.SpriteFrame)
                }
            }
            none = parent.getChildByName((this.bean.key.x-1)+"-"+this.bean.key.y)
            sp = this.node.getChildByName("0")
            fun(none,sp)
            none = parent.getChildByName(this.bean.key.x+"-"+(this.bean.key.y+1))
            sp = this.node.getChildByName("1")
            fun(none,sp)
            none = parent.getChildByName((this.bean.key.x+1)+"-"+this.bean.key.y)
            sp = this.node.getChildByName("2")
            fun(none,sp)
            none = parent.getChildByName(this.bean.key.x+"-"+(this.bean.key.y-1))
            sp = this.node.getChildByName("3")
            fun(none,sp)
        }else{
            this.sprite.spriteFrame = cc.loader.getRes("texture/"+this.bean.id,cc.SpriteFrame)
        }
        
    }

    //更新位置方向
    updateDs(dt){
        let x = 0
        if(this.ds[0]){
            x = -1
            if(this.ds[2]){
                x = 0
            }
        }else if(this.ds[2]){
            x = 1
        }
        this.node.x += x*this.bean.speed

        let y = 0
        if(this.ds[1]){
            y = 1
            if(this.ds[3]){
                y = 0
            }
        }else if(this.ds[3]){
            y = -1
        }
        this.node.y += y*this.bean.speed
    }

    //更新敌人
    updateEnemy(dt){
        if(!this.bean.checkEnemy()){
            return
        }
        for(let i=0;i<this.ds.length;i++){
            if(this.ds[i]){
                //有移动就跳过
                return
            }
        }
        
        if(this.bean.patrol == 0){
            //拐弯
            let d = -1
            while(true){
                d = Math.floor(Math.random()*4)
                if(d != this.firstD){
                    break
                }
            }
            this.ds[d] = 1
            this.firstD = d
        }else if(this.bean.patrol == 1){
            //左右
            let d = 0
            if(this.firstD == -1){
                //随机一个
                if(Math.random()<0.5){
                    d = 2
                }
            }else{
                d = this.firstD == 0?2:0
            }
            this.ds[d] = 1
            this.firstD = d
        }else if(this.bean.patrol == 2){
            //上下
            let d = 1
            if(this.firstD == -1){
                //随机一个
                if(Math.random()<0.5){
                    d = 3
                }
            }else{
                d = this.firstD == 1?3:1
            }
            this.ds[d] = 1
            this.firstD = d
        }

        // //自主巡逻
        // for(let i=0;i<this.ds.length;i++){
        //     if(this.ds[i]){
        //          //有一个方向不等于0都表示在巡逻中
        //          if(Math.random()<0.001){
        //              //概率性转移方向
        //              this.ds[i] = 0
        //          }
        //         return
        //     }
        // }
        // if(Math.random()<0.1){
        //     //随机一个方向巡逻
        //     this.ds[Math.floor(Math.random()*4)] = 1
        // }
    }

    frameCount:number = 0
    //帧数下标
    frameIndex:number = 0
    //更新帧数
    updateFrame(dt){
        this.frameCount ++
        if(this.bean.id == 110){
            //出现暂停道具
            if(this.frameCount >= Config.refreshPaustToolFrame){
                this.frameCount = 0
                this.newBox(this.bean.key,210)
            }
        }else if(this.bean.id == 111){
            //出现暂停道具
            if(this.frameCount >= Config.refreshPaustToolFrame){
                this.frameCount = 0
                this.newBox(this.bean.key,211)
            }
        }else if(this.bean.id == 112){
            //出现暂停道具
            if(this.frameCount >= Config.refreshPaustToolFrame){
                this.frameCount = 0
                this.newBox(this.bean.key,212)
            }
        }else if(this.bean.id == 1 || this.bean.id == 2 || this.bean.checkEnemy()){
            if(this.frameCount >= 20){
                this.frameCount = 0
                if(this.frameIndex == 0){
                    this.frameIndex = 1
                }else{
                    this.frameIndex = 0
                }
                this.sprite.spriteFrame = cc.loader.getRes(`frame/${this.bean.id}_${this.frameIndex}`,cc.SpriteFrame)
            }
        }
    }

    newBox(pos:cc.Vec2,id:number){
        //是否存在
        let node = this.node.parent.getChildByName(`${pos.x}-${pos.y}-${id}`)
        if(node){
            return
        }
        let box = cc.instantiate(this.node)
        this.node.parent.addChild(box)
        let boxJs = box.getComponent("Box") as Box
        box.name = `${pos.x}-${pos.y}-${id}`
        boxJs.initData(new BoxBean(id,pos))
    }

    update (dt) {
        if(!Config.playing){
            return
        }
        if(this.disabledFrame > 0){
            this.node.opacity = 128
            this.disabledFrame --
            return
        }else{
            this.node.opacity = 255
        }
        if(this.pauseFrame > 0){
            this.pauseFrame -- 
            return
        }
        this.updateFrame(dt)
        this.updateEnemy(dt)
        this.updateDs(dt)
        //不要出界
        if(this.node.x < Config.unit/2){
            this.node.x = Config.unit/2
            if(this.bean.checkEnemy()){
                this.ds[0] = 0
                this.ds[2] = 0
            }
        }else if(this.node.x > Config.unit*(Config.wNumber-0.5)){
            this.node.x = Config.unit*(Config.wNumber-0.5)
            if(this.bean.checkEnemy()){
                this.ds[0] = 0
                this.ds[2] = 0
            }
        }
        //不要出界
        if(this.node.y < Config.unit/2){
            this.node.y = Config.unit/2
            if(this.bean.checkEnemy()){
                this.ds[1] = 0
                this.ds[3] = 0
            }
        }else if(this.node.y > Config.unit*(Config.hNumber-0.5)){
            this.node.y = Config.unit*(Config.hNumber-0.5)
            if(this.bean.checkEnemy()){
                this.ds[1] = 0
                this.ds[3] = 0
            }
        }
    }

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        if(!Config.playing){
            return
        }
        // console.log('on collision enter',self);
        let selfJs = self.node.getComponent("Box") as Box
        let otherJs = other.node.getComponent("Box") as Box
        //判断是否是食物
        if(selfJs.bean.checkHero() && otherJs.bean.checkFood()){
            if(otherJs.bean.id%10 == selfJs.bean.id){
                otherJs.actionEat(selfJs.bean.id)
                //如果吃的是有效果的道具
                if(otherJs.bean.id == 211){
                    //桃心敌人暂停
                    cc.game.emit("pause-frame",12,Config.pauseFrame)
                }else if(otherJs.bean.id == 212){
                    //三角敌人暂停
                    cc.game.emit("pause-frame",11,Config.pauseFrame)
                }else if(otherJs.bean.checkSoybean()){
                    //豆子
                    Config.soybeanNumber --
                }
            }else if(otherJs.bean.id == 203){
                otherJs.actionEat(selfJs.bean.id)
                //角色转换位置
                cc.game.emit("tool-203")
                AudioUtils.play203()
            }else if(otherJs.bean.id == 200){
                otherJs.actionEat(selfJs.bean.id)
                //豆子
                Config.soybeanNumber --
            }else if(otherJs.bean.id == 210){
                otherJs.actionEat(selfJs.bean.id)
                //黑云暂停
                cc.game.emit("pause-frame",10,Config.pauseFrame)
            }
            console.log("豆子"+Config.soybeanNumber)
            if(Config.soybeanNumber <= 0){
                cc.game.emit("show-game-pass")
                var manager = cc.director.getCollisionManager()
                manager.enabled = false
                Config.playing = false
            }
            return
        }

        //判断死亡
        if(selfJs.bean.checkHero() && otherJs.bean.checkEnemy() && (otherJs.bean.id%10 == selfJs.bean.id || otherJs.bean.id==10)){
            cc.game.emit("show-game-over")
            var manager = cc.director.getCollisionManager();
            manager.enabled = false;
            Config.playing = false
            return
        }else if(otherJs.bean.checkHero() && selfJs.bean.checkEnemy() && (otherJs.bean.id%10 == selfJs.bean.id || otherJs.bean.id==10)){
            cc.game.emit("show-game-over")
            var manager = cc.director.getCollisionManager();
            manager.enabled = false;
            Config.playing = false
            return
        }else if(
            (selfJs.bean.checkHero() && otherJs.bean.checkHero()) ||
            (selfJs.bean.checkHero() && otherJs.bean.checkEnemy()) ||
            (selfJs.bean.checkEnemy() && otherJs.bean.checkHero())
        ){
            AudioUtils.playCollision3()
        }

        //判断机关
        if(otherJs.bean.checkDevice()){
            if(otherJs.bean.id == 204){
                //传送
                let children = otherJs.node.parent.children
                let datas = {}
                children.forEach(function(value){
                    let js = value.getComponent("Box")
                    if(js.bean.id == otherJs.bean.id && 
                        js.node.name != otherJs.node.name && js.disabledFrame <= 0){
                            //就是它
                            otherJs.disabledFrame = 180
                            js.disabledFrame = 180
                            selfJs.actionDelivery(js.node.position)
                            return
                    }
                })
                return
            }else if(otherJs.bean.id == 205){
                //组合机关、门钥匙
                let children = otherJs.node.parent.children
                let datas = {}
                children.forEach(function(value){
                    let js = value.getComponent("Box")
                    if(js.bean.id == 206){
                            //找到门
                            js.actionShake(selfJs.node.name)
                            return
                    }
                })
                return
            }
        }
        
        //不让相交
        if(selfJs.ds[2] &&  otherJs.node.x - selfJs.node.x > 0 && otherJs.node.x - selfJs.node.x < Config.unit && selfJs.node.x < otherJs.node.x && Math.abs(selfJs.node.x - otherJs.node.x)>Math.abs(selfJs.node.y - otherJs.node.y)){
            //因为是右移
            selfJs.node.x = otherJs.node.x - otherJs.bean.unit 
            if(selfJs.bean.checkEnemy()){
                selfJs.ds[0] = 0
                selfJs.ds[2] = 0
            }
        }else if(selfJs.ds[0] && selfJs.node.x - otherJs.node.x > 0 && selfJs.node.x - otherJs.node.x < Config.unit && Math.abs(selfJs.node.x - otherJs.node.x)>Math.abs(selfJs.node.y - otherJs.node.y)){
            //左移
            selfJs.node.x = otherJs.node.x + otherJs.bean.unit 
            if(selfJs.bean.checkEnemy()){
                selfJs.ds[0] = 0
                selfJs.ds[2] = 0
            }
        }

        if(selfJs.ds[1] && otherJs.node.y - selfJs.node.y > 0 && otherJs.node.y - selfJs.node.y < Config.unit  && Math.abs(selfJs.node.y - otherJs.node.y)>Math.abs(selfJs.node.x - otherJs.node.x)){
            //上移
            selfJs.node.y = otherJs.node.y - otherJs.bean.unit 
            if(selfJs.bean.checkEnemy()){
                selfJs.ds[1] = 0
                selfJs.ds[3] = 0
            }
        }else if(selfJs.ds[3] && selfJs.node.y - otherJs.node.y > 0 && selfJs.node.y - otherJs.node.y < Config.unit && Math.abs(selfJs.node.y - otherJs.node.y)>Math.abs(selfJs.node.x - otherJs.node.x)){
            //下移
            selfJs.node.y = otherJs.node.y + otherJs.bean.unit 
            if(selfJs.bean.checkEnemy()){
                selfJs.ds[1] = 0
                selfJs.ds[3] = 0
            }
        }
        if(selfJs.bean.checkHero() && otherJs.bean.checkObstacle()){
            AudioUtils.playCollision()
        }
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        let selfJs = self.node.getComponent("Box") as Box
        let otherJs = other.node.getComponent("Box") as Box
        //判断机关
        if(otherJs.bean.checkDevice()){
            if(otherJs.bean.id == 205){
                //组合机关、门钥匙
                let children = otherJs.node.parent.children
                let datas = {}
                children.forEach(function(value){
                    let js = value.getComponent("Box")
                    if(js.bean.id == 206){
                            //找到门
                            js.stopShake()
                            return
                    }
                })
                return
            }
        }
    }

    //豆子被吃了
    actionEat(id:number){
        AudioUtils.playEat(id)
        this.node.removeComponent(cc.BoxCollider)
        let action = cc.scaleTo(0.1,0,0)
        let seq = cc.sequence(action,cc.callFunc(function(){
            this.node.removeFromParent()
        }.bind(this)))
        this.node.runAction(seq)
    }

    //传送
    actionDelivery(pos:cc.Vec2){
        AudioUtils.play204()
        this.pauseFrame = 48
        let a1 = cc.scaleTo(0.3,0,0)
        let call = cc.callFunc(function(){
            this.node.position = pos
        }.bind(this))
        let a2 = cc.scaleTo(0.5,1,1)
        let seq = cc.sequence(a1,call,a2)
        this.node.runAction(seq)
    }

    //抖动
    actionShake(name:string){
        if(this.openDoorName && this.openDoorName != name){
            //开门
            this.stopShake()
            AudioUtils.playOpen()
            this.node.getComponent(cc.BoxCollider).enabled = false
            let action = cc.fadeOut(0.3)
            let call = cc.callFunc(function(){
                this.node.removeFromParent()
            }.bind(this))
            let seq = cc.sequence(action,call)
            seq.setTag(123)
            this.node.runAction(seq)
        }
        if(this.node.getActionByTag(123)){
            return
        }
        let a1 = cc.rotateTo(0.1,-5)
        let a2 = cc.rotateTo(0.1,0)
        let a3 = cc.rotateTo(0.1,5)
        let a4 = cc.rotateTo(0.1,0)
        let seq = cc.sequence(a1,a2,a3,a4)
        let repeat = cc.repeatForever(seq)
        repeat.setTag(123)
        this.node.runAction(repeat)
        this.openDoorName = name
    }

    //停止抖动
    stopShake(){
        if(this.node.getActionByTag(123)){
            this.node.stopActionByTag(123)
            this.openDoorName = ""
        }
    }

    //自旋转
    rotateRepeat(){
        let a1 = cc.rotateBy(0.1,5)
        let repeat = cc.repeatForever(a1)
        this.node.runAction(repeat)
    }

    //主角光环
    heroBill(node:cc.Node){
        let a1 = cc.scaleTo(1,1.3,1.3)
        let a2 = cc.delayTime(0.2)
        let a3 = cc.scaleTo(1,1,)
        let a4 = cc.delayTime(0.2)
        let seq = cc.sequence(a1,a2,a3,a4)
        let repeat = cc.repeatForever(seq)
        node.runAction(repeat)
    }

}
