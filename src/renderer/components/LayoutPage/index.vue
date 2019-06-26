<template>
    <div class="layout-page">
        <div class="custom">
            <div class="left">
                <p>欢迎使用网易云音乐!</p>
            </div>
            <div class="right">
                <!-- <div style="line-height:40px;padding:0 12px;cursor:pointer;" @click="openDevTool">F12</div> -->
                <p @click="changeStatus('min')">
                    <span class="min"></span>
                </p>
                <p @click="changeStatus('max')">
                    <span class="max"></span>
                </p>
                <p @click="changeStatus('close')">
                    <span class="close"></span>
                </p>
            </div>
        </div>
        <div class="my-main">
            <div class="header">
                <div class="header-box mW">
                    <div class="logo" @click="toHome"></div>
                    <ul>
                        <li @click="changeHeaderTab(index)" :class="{active:headerIndex==index}" v-for="(item,index) in headerList" :key="item.id">{{item.title}}</li>
                    </ul>
                    <!-- <p class="search">
                        <i></i>
                        <input type="text" placeholder="音乐/视频/电台/用户">
                    </p>
                    <p class="login">
                        <span>登录</span>
                        <i></i>
                    </p> -->
                </div>
                <div class="tabmenu"></div>
            </div>
            <div class="main">
                <router-view @changeAudioSrc="changeAudioSrc"></router-view>
            </div>
        </div>
        <div class="choose-song">
            <div class="choose-song-box mW">
                <div class="song-left">
                    <span class="prev" @click="prevPlay"></span>
                    <span :class="musicIsPlay?'actual-play':'play'" @click="playMusic"></span>
                    <span class="next" @click="nextPlay"></span>
                </div>
                <div class="song-center">
                    <img :src="imgUrl" alt="">
                    <span class="song-name">{{songName}}　{{singerName}}</span>
                    <span class="begin">{{nowProg?nowProg:'00:00'}}</span>
                    <div class="progress">
                        <p class="all-prog" @click="allProgMouseDown"></p>
                        <p class="actual-prog" ref="actualProg" @click="allProgMouseDown"></p>
                        <span ref="progPoint" @mousedown="pointMouseDown"></span>
                    </div>
                    <span class="over">{{allProgress?milliscondFilter(allProgress):'00:00'}}</span>
                </div>
                <div class="song-right">
                    <div class="volume">
                        <span :class="isStopVolume?'hasVolume':'noVolume'" @click="changeVolume"></span>
                        <p class="all-volume" @click="allVolumeControl"></p>
                        <p class="actual-volume" ref="actualVolume" @click="allVolumeControl"></p>
                        <span class="control" ref="volumePoint" @mousedown="volumeMouseDown"></span>
                    </div>
                </div>
                <audio :src="audioSrc" ref="playAudio" v-show="false" controls autoplay loop preload="auto">别试了，是你的浏览器渣渣</audio>
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { getSongSrc,getSongDetail } from '../../api/default.js'
import { setInterval, clearInterval } from 'timers';
import $ from 'jquery'
export default {
    name:'layout-page',
    data(){
        return {
            headerList:[
                {
                    id:1,
                    title:'发现音乐'
                },
                // {
                //     id:2,
                //     title:'我的音乐'
                // },
                // {
                //     id:3,
                //     title:'朋友'
                // },
                // {
                //     id:4,
                //     title:'商城'
                // },
                // {
                //     id:5,
                //     title:'下载客户端'
                // },
            ],
            headerIndex:0,
            audioSrc:'',

            //音乐控制
            musicIsPlay:false,
            nowProgress:0,
            nowProg:'',
            allProgress:0,

            volume:1,
            isStopVolume:true,

            nowVolume:1,

            myChooseSongList:[],
            nowPlaySongIndex:'',

            imgUrl:'',
            songName:'',
            singerName:''

        }
    },
    created(){
        if(this.$store.getters.getSongSrc){
            this.musicIsPlay = true;
            this.audioSrc = this.$store.getters.getSongSrc.url;
            this.allProgress = this.$store.getters.getSongSrc.time;
            this.nowPlaySongIndex = this.$store.getters.getSongSrc.index;
        }else{
            this.musicIsPlay = false;
        }

        if(this.$store.getters.getTracks){
            this.myChooseSongList = this.$store.getters.getTracks;
        }
        console.log(this.$store.getters.getNowPlaySongInfo)
        if(this.$store.getters.getNowPlaySongInfo){
            let songInfo = this.$store.getters.getNowPlaySongInfo
            this.allProgress = songInfo.allProgress
            this.imgUrl = songInfo.imgUrl
            this.songName = songInfo.songName
            this.singerName = songInfo.singerName
        }
    },
    mounted(){
        this.$store.dispatch('savePlaySongData','')
        document.onkeydown = (e)=>{
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode === 123){
                ipcRenderer.send('open');
            }
        }
        let timer = setInterval(()=>{
            let allTime = Math.floor(this.allProgress/1000)
            if(this.nowProgress>=allTime){
                this.nextPlay();
                // clearInterval(timer)
                // this.$refs.playAudio.pause();
                // this.musicIsPlay = false;
            }
            this.nowProgress = this.getCurrentTime()
        },1000)
    },
    computed:{
        // isSrc () {
        //     return this.$store.state.isPlaySongSrc;
        // }
    },
    watch:{
        // isSrc(val,oldVal){
        //     console.log('------>',val)
        //     if(val){
        //         this.getPlaySongSrc(val)
        //     }
        // }
        nowProgress(val,oldVal){
            // console.log('---',this.timeFilter(Math.floor(val)))
            let l = 500/Math.floor(this.allProgress/1000)*val;
            if(l>=500){
                l = 500;
            }
            $(this.$refs.progPoint).css({left:l})
            $(this.$refs.actualProg).css({width:l})
            this.nowProg = this.timeFilter(Math.floor(val))
        }
    },
    methods:{
        prevPlay(){
            this.myChooseSongList = this.$store.getters.getTracks;
            if(this.nowPlaySongIndex-1>=0){
                let id = this.myChooseSongList[this.nowPlaySongIndex-1].id;
                this.changeAudioSrc({
                    id:id,
                    index:this.nowPlaySongIndex-1
                })
            }else{
                let id = this.myChooseSongList[this.myChooseSongList.length].id;
                this.changeAudioSrc({
                    id:id,
                    index:this.myChooseSongList.length
                })
            }
        },
        nextPlay(){
            this.myChooseSongList = this.$store.getters.getTracks;
            if(this.nowPlaySongIndex+1<=this.myChooseSongList.length-1){
                let id = this.myChooseSongList[this.nowPlaySongIndex+1].id;
                this.changeAudioSrc({
                    id:id,
                    index:this.nowPlaySongIndex+1
                })
            }else{
                let id = this.myChooseSongList[0].id;
                this.changeAudioSrc({
                    id:id,
                    index:0
                })
            }
        },
        //音乐音量
        changeVolume(){
            let thisAudio = this.$refs.playAudio;
            this.isStopVolume = !this.isStopVolume;
            if(!this.isStopVolume){
                thisAudio.muted = true;//静音
                $(this.$refs.volumePoint).css({left:30})
                $(this.$refs.actualVolume).css({width:0})
            }else{
                thisAudio.muted = false;
                $(this.$refs.volumePoint).css({left:30+(100*this.volume)})
                $(this.$refs.actualVolume).css({width:(100*this.volume)})
            }
        },
        allVolumeControl(e){
            let thisAudio = this.$refs.playAudio;
            let left = $(e.target).parent().offset().left+37;
            let x = e.pageX;
            $(this.$refs.volumePoint).css({left:(x-left+30)})
            $(this.$refs.actualVolume).css({width:(x-left)})
            let l = (x-left)/100
            if(l<=0.03){
                this.isStopVolume = false;
                this.volume = 0;
            }else if(l>=0.97){
                this.volume = 1;
            }else{
                this.volume = l;
            }
            this.volume = l;
            thisAudio.volume = this.volume;
        },
        volumeMouseDown(e){
            let thisAudio = this.$refs.playAudio;

            let ele = e.target
            //算出鼠标相对元素的位置
            let disX = e.clientX - (ele.offsetLeft);
            // let disY = e.clientY - ele.offsetTop;
            document.onmousemove = (e)=>{       //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;    
                // let top = e.clientY - disY;
                
                //绑定元素位置到positionX和positionY上面
                // this.positionX = top;
                // this.positionY = left;
                if(left<=30||left>=130){
                    return;
                }
                thisAudio.muted = false
                this.isStopVolume = true;
                //移动当前元素
                ele.style.left = left + 'px';
                $(this.$refs.actualVolume).css({width:left-30})
                // ele.style.top = top + 'px';
                let l = (left-30)/100
                if(l<=0.03){
                    this.isStopVolume = false;
                    this.volume = 0;
                }else if(l>=0.97){
                    this.volume = 1;
                }else{
                    this.volume = l;
                }
                thisAudio.volume = this.volume;

            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        //进度
        allProgMouseDown(e){
            let left = $(e.target).parent().offset().left;
            let x = e.pageX;
            let l = Math.floor(this.allProgress/1000)/500*(x-left)
            // $(this.$refs.progPoint).animate({left:(x-left-8),speed:50})
            $(this.$refs.progPoint).css({left:(x-left-8)})
            // $(this.$refs.actualProg).animate({width:(x-left-8),speed:50})
            $(this.$refs.actualProg).css({width:(x-left-8)})
            this.nowProg = this.timeFilter(Math.floor(l))
            this.$refs.playAudio.currentTime = l;
        },
        pointMouseDown(e){
            this.$refs.playAudio.pause();
            this.musicIsPlay = false;

            let ele = e.target
            //算出鼠标相对元素的位置
            let disX = e.clientX - ele.offsetLeft;
            // let disY = e.clientY - ele.offsetTop;
            document.onmousemove = (e)=>{       //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;    
                // let top = e.clientY - disY;
                
                //绑定元素位置到positionX和positionY上面
                // this.positionX = top;
                // this.positionY = left;
                //移动当前元素
                if(left<=0||left>=500){
                    return;
                }
                $(this.$refs.actualProg).css({width:left})
                ele.style.left = left + 'px';
                
                // ele.style.top = top + 'px';
                let l = Math.floor(this.allProgress/1000)/500*left
                this.$refs.playAudio.currentTime = l;

            };
            document.onmouseup = (e) => {
                this.$refs.playAudio.play();
                this.musicIsPlay = true;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        getCurrentTime(){
            let thisAudio = this.$refs.playAudio;
            return thisAudio.currentTime
        },
        //音乐播放/暂停
        playMusic(){
            let thisAudio = this.$refs.playAudio;
            if(this.musicIsPlay){
                thisAudio.pause();//暂停
            }else{
                thisAudio.play();//播放
            }
            this.musicIsPlay = !this.musicIsPlay;
        },
        async changeAudioSrc(data){
            
            this.nowPlaySongIndex = data.index;
            let detail = await this.getPlaySongDetail(data.id);
            await this.getPlaySongSrc(data.id)
        },
        async getPlaySongSrc(id){
            getSongSrc({id:id,quality:'flac',isRedirect:0}).then((data)=>{
                if(data.code===200){
                    this.musicIsPlay = true;
                    this.audioSrc = data.data;
                    this.$store.dispatch('saveNowPlaySong',{
                        url:data.data,
                        time:this.allProgress,
                        index:this.nowPlaySongIndex
                    })
                }
            })
        },
        async getPlaySongDetail(id){
            getSongDetail({id:id}).then((data)=>{
                if(data.code===200){
                    this.allProgress = data.data.songs[0].dt;
                    this.imgUrl = data.data.songs[0].al.picUrl;
                    this.singerName = data.data.songs[0].ar[0].name;
                    this.songName = data.data.songs[0].name;
                    this.$store.dispatch('saveSongInfo',{
                        allProgress:this.allProgress,
                        imgUrl:this.imgUrl,
                        singerName:this.singerName,
                        songName:this.songName,
                    })
                }
            })
        },
        openDevTool(){
            ipcRenderer.send('open');
        },
        toHome(){
            this.$router.push('/')
        },
        changeHeaderTab(index){
            this.headerIndex = index;
        },
        changeStatus(type){
            switch(type){
                case 'min':
                    ipcRenderer.send('min');
                    break;
                case 'max':
                    ipcRenderer.send('max');
                    break;
                case 'close':
                    ipcRenderer.send('close');
                    break;
            }
        },
        milliscondFilter(time){
            let trueTime = Math.floor(time/1000);
            let m = Math.floor(trueTime/60)<10?'0'+Math.floor(trueTime/60):Math.floor(trueTime/60);
            let s = trueTime%60<10?'0'+trueTime%60:trueTime%60; 
            return m+':'+s;
        },
        timeFilter(time){
            let m = Math.floor(time/60)<10?'0'+Math.floor(time/60):Math.floor(time/60);
            let s = time%60<10?'0'+time%60:time%60;
            return m+':'+s;
        },
    }
}
</script>

<style lang="scss">
.layout-page{
    overflow: hidden;
    
    .main{
        
    }
    .my-main{
        overflow-y: auto;
        height: calc(100vh - 40px);
    }
    .custom{
        background: #666;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-app-region: drag;
        .left{
            padding: 6px 10px;
            p{
                color: #fff;
                font-size: 16px;
            }
        }
        .right{
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-app-region: no-drag;
            span{
                display: block;
                width: 16px;
                height: 16px;
                margin: 0 12px;
                margin-top: 12px;
            }
            p{
                height: 40px;
                line-height: 28px;
                cursor: pointer;
                &:hover{
                    background: #555;
                }
            }
            .min{
                background: url('../../assets/images/min.png') no-repeat 100%/cover;
                
            }
            .max{
                background: url('../../assets/images/max.png') no-repeat 100%/cover;
            }
            .close{
                background: url('../../assets/images/close.png') no-repeat 100%/cover;
            }
        }
    }
    .header{
        background: #242424;
    }
    .header-box{
        padding: 0 20px;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        // -webkit-box-pack: justify;
        // -ms-flex-pack: justify;
        // -webkit-justify-content: space-between;
        // justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        ul{
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            li{
                padding: 0 19px;
                line-height: 70px;
                font-size: 14px;
                color: #ccc;
                text-align: center;
                cursor: pointer;
                &:hover{
                    color: #fff;
                    background: #000;
                }
                &.active{
                    color: #fff;
                    background: #000;
                    position: relative;
                    &::before{
                        content: "";
                        border-bottom: 6px solid #C20C0C; 
                        border-left: 6px solid transparent; 
                        border-right: 6px solid transparent; 
                        border-top: 6px solid transparent; 
                        position: absolute;
                        left: 50%;
                        bottom: 0px;
                        transform: translateX(-50%);
                    }
                }
            }
        }
    }
    .logo{
        width: 176px;
        height: 70px;
        cursor: pointer;
        background-position: 0 0;
        background: url('../../assets/images/topbar.png') no-repeat 0 0;
    }
    .login{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        span{
            color: #787878;
            font-size: 12px;
        }
        i{
            display: block;
            width: 16px;
            height: 8px;
            position: relative;
            top: 2px;
            background: url('../../assets/images/topbar.png') no-repeat -224px -60px;
        }
    }
    .search{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        height: 32px;
        padding: 3px 12px;
        border-radius: 32px;
        background: #fff;
        i{
            display: block;
            width: 16px;
            height: 16px;
            position: relative;
            top: 2px;
            background: url('../../assets/images/topbar.png') no-repeat -7px -108px;
        }
        input{
            color: #9b9b9b;
            margin-left: 3px;
        }
    }
    .tabmenu{
        height: 5px;
        background-color: #C20C0C;
    }
    .choose-song{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 60px;
        background: #333;
        box-shadow: 0 .1em .3em .1em #d5d5d5;
        .choose-song-box{
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
        }
        .song-left{
            margin-top: 13px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
            .prev{
                cursor: pointer;
                display: block;
                width: 28px;
                height: 28px;
                background: url('../../assets/images/playbar.png') no-repeat 0px -130px;
                &:hover{
                    background: url('../../assets/images/playbar.png') no-repeat -30px -130px;
                }
            }
            .play{
                cursor: pointer;
                display: block;
                width: 36px;
                height: 36px;
                background: url('../../assets/images/playbar.png') no-repeat 0px -204px;
                margin: 0 12px;
                &:hover{
                    background: url('../../assets/images/playbar.png') no-repeat -40px -204px;
                }
            }
            .actual-play{
                cursor: pointer;
                display: block;
                width: 36px;
                height: 36px;
                background: url('../../assets/images/playbar.png') no-repeat 0px -165px;
                margin: 0 12px;
                &:hover{
                    background: url('../../assets/images/playbar.png') no-repeat -40px -165px;
                }
            }
            .next{
                cursor: pointer;
                display: block;
                width: 28px;
                height: 28px;
                background: url('../../assets/images/playbar.png') no-repeat -80px -130px;
                &:hover{
                    background: url('../../assets/images/playbar.png') no-repeat -110px -130px;
                }
            }
        }
        .song-center{
            margin: 0 30px;
            padding-top: 13px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
            position: relative;
            img{
                width: 36px;
                height: 36px;
                margin-right: 10px;
            }
            .song-name{
                position: absolute;
                left: 46px;
                top: 10px;
                color: #fff;
                font-size: 12px;
            }
            .begin{
                color: #d5d5d5;
                font-size: 12px;
                line-height: 16px;
                margin-top: 13px;
            }
            .progress{
                position: relative;
                margin: 13px 16px 0;
                span{
                    cursor: pointer;
                    display: block;
                    width: 22px;
                    height: 24px;
                    position: absolute;
                    left: 0px;//485px
                    top: -7px;
                    background: url('../../assets/images/iconall.png') no-repeat 0px -250px;
                    &:hover{
                        background: url('../../assets/images/iconall.png') no-repeat 0px -280px;
                    }
                }
                .all-prog{
                    cursor: pointer;
                    width: 500px;
                    height: 6px;
                    margin-left: 5px;
                    background: #999;
                    border-radius: 6px;
                    box-shadow: 0 0.1em 0.3em 0.1em #666 inset;
                }
                .actual-prog{
                    cursor: pointer;
                    position: absolute;
                    left: 5px;
                    top: 0;
                    width: 0px;
                    height: 6px;
                    background: #C20C0C;
                    border-radius: 6px;
                    box-shadow: 0 -0.1em 0.3em 0.1em #ff0C0C inset;
                }
            }
            .over{
                margin-top: 13px;
                color: #d5d5d5;
                font-size: 12px;
                line-height: 16px;
            }
        }
        .song-right{
            margin-top: 13px;
            .volume{
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                -webkit-align-items: center;
                align-items: center;
                position: relative;
                span.noVolume{
                    cursor: pointer;
                    width: 25px;
                    height: 25px;
                    display: block;
                    background: url('../../assets/images/playbar.png') no-repeat -104px -69px;
                }
                span.hasVolume{
                    cursor: pointer;
                    width: 25px;
                    height: 25px;
                    display: block;
                    background: url('../../assets/images/playbar.png') no-repeat -2px -248px
                }
                .control{
                    cursor: pointer;
                    display: block;
                    width: 22px;
                    height: 24px;
                    position: absolute;
                    left: 130px;//120px
                    top: 0px;
                    background: url('../../assets/images/iconall.png') no-repeat 0px -250px;
                    &:hover{
                        background: url('../../assets/images/iconall.png') no-repeat 0px -280px;
                    }
                }
                p{
                    width: 100px;
                    height: 6px;
                    border-radius: 6px;
                    margin-left: 12px;
                }
                .all-volume{
                    cursor: pointer;
                    background: #ccc;
                    box-shadow: 0 0.1em 0.3em 0.1em #999 inset;
                }
                .actual-volume{
                    cursor: pointer;
                    position: absolute;
                    width: 100px;
                    left: 25px;
                    top: 9px;
                    background: #C20C0C;
                    box-shadow: 0 0.1em 0.3em 0.1em #ff0C0C inset;
                }
            }

        }
    }
}
</style>
