import FirstAudioSetting from "./first/FirstAudioSetting";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class AudioUtils {

    static playBgmMain(){
        if(FirstAudioSetting.getAudioStatus() != "true"){
            return
        }
        cc.audioEngine.stopMusic()
        let clip = cc.loader.getRes("audio/bgm_main",cc.AudioClip)
        cc.audioEngine.playMusic(clip,true)
    }

    static playBgmGame(){
        if(FirstAudioSetting.getAudioStatus() != "true"){
            return
        }
        cc.audioEngine.stopMusic()
        let clip = cc.loader.getRes("audio/bgm_game",cc.AudioClip)
        cc.audioEngine.playMusic(clip,true)
    }

    static playGamePass(){
        cc.audioEngine.stopMusic()
        this.playEffect("audio/game_pass")
    }

    static playGameOver(){
        cc.audioEngine.stopMusic()
        this.playEffect("audio/game_over")
    }

    static playClick(){
        this.playEffect("audio/btn_click")
    }

    static playEat(id){
        this.playEffect("audio/eat_"+id)
    }

    static play203(){
        this.playEffect("audio/204")
    }
    
    static play204(){
        this.playEffect("audio/204")
    }

    static playOpen(){
        this.playEffect("audio/open")
    }

    static collisonTime:number = 0
    static first:number = 1
    static playCollision(){
        let now = new Date().getTime()
        if(this.collisonTime != 0 && (now - this.collisonTime < 500)){
            return
        }
        if(this.first == 1){
            this.first = 2
        }else{
            this.first = 1
        }
        this.collisonTime = now
        this.playEffect("audio/collision_"+this.first)
    }

    static collisonTime3:number = 0
    static playCollision3(){
        let now = new Date().getTime()
        if(this.collisonTime3 != 0 && (now - this.collisonTime3 < 1000)){
            return
        }
        this.collisonTime3 = now
        this.playEffect("audio/collision_3")
    }

    static playEffect(path:string):number{
        let clip = cc.loader.getRes(path,cc.AudioClip)
        return cc.audioEngine.playEffect(clip,false)
    }

}
