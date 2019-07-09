import AudioUtils from "../AudioUtils";

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
export default class FirstAudioSetting extends cc.Component {

    @property(cc.SpriteFrame)
    spriteFrameOpen: cc.SpriteFrame = null

    @property(cc.SpriteFrame)
    spriteFrameClose: cc.SpriteFrame = null

    @property(cc.Sprite)
    sprite:cc.Sprite = null

    onLoad () {
        this.updateView()
    }

    onClick(){
        let open = FirstAudioSetting.getAudioStatus()
        if(open == "true"){
            FirstAudioSetting.setAudioStatus("false")
        }else{
            FirstAudioSetting.setAudioStatus("true")
        }
        this.updateView()
    }

    static getAudioStatus():string{
        let status = cc.sys.localStorage.getItem("audio-status")
        if(!status){
            status = "true"
        }
        return status
    }

    static setAudioStatus(status:string){
        cc.sys.localStorage.setItem("audio-status",status)
    }

    updateView(){
        let open = FirstAudioSetting.getAudioStatus()
        if(open == "true"){
            if(cc.director.getScene().name == "Main"){
                AudioUtils.playBgmMain()
            }else{
                AudioUtils.playBgmGame()
            }
            this.sprite.spriteFrame = this.spriteFrameOpen
        }else{
            cc.audioEngine.stopMusic()
            this.sprite.spriteFrame = this.spriteFrameClose
        }
    }

}
