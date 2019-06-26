<template>
    <div class="song-list-detail mW">
        <div class="song-list-info">
            <div class="left">
                <img :src="coverImgUrl" alt="">
            </div>
            <div class="right">
                <p class="r-title">
                    <span class="type"></span>
                    <span class="title">{{title}}</span>
                    <span class="num">
                        歌曲数
                        <i>{{trackCount}}</i>
                    </span>
                    <span class="shu"></span>
                    <span class="num">
                        播放数
                        <i>{{playCount}}</i>
                    </span>
                </p>
                <p class="user-info">
                    <span class="u-img">
                        <img :src="avatarUrl" alt="">
                    </span>
                    <span class="name">{{nickname}}</span>
                    <span class="time">{{createTime}} 创建</span>
                </p>
                <p class="tag">
                    <span @click="playSong(tableList[0].id,0)"><i class="play"></i>播放全部</span>
                    <!-- <span><i class="collect"></i>收藏({{subscribedCount}})</span>
                    <span><i class="share"></i>分享({{shareCount}})</span>
                    <span><i class="download"></i>下载全部</span> -->
                </p>
                <div class="label">
                    <p class='l-tag'>
                        <span>标签：</span>
                        <span v-for="(item,index) in expertTags" :key="index">{{item}}</span>
                    </p>
                    <p class="introduce">
                        介绍：{{description}}
                    </p>
                </div>
            </div>
        </div>
        <div class="song-list">
            <div class="song-header">
                <h3>歌曲列表</h3>
            </div>
            <div class="tabel">
                <table table-layout="fixed">
                    <thead>
                        <tr>
                            <td style="width:80px;">序号</td>
                            <td style="width:120px;">操作</td>
                            <td style="width:260px;">音乐标题</td>
                            <td style="width:240px;">歌手</td>
                            <td style="width:240px;">专辑</td>
                            <td style="width:160px;">时长</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tableList" :key="index">
                            <td>{{index+1}}</td>
                            <td><i class="play-song" @click="playSong(item.id,index)"></i></td>
                            <td>{{item.name}}</td>
                            <td>{{item.artists[0].name}}</td>
                            <td>{{item.album.name}}</td>
                            <td>{{item.bMusic?timeFilter(item.bMusic.playTime):'~'}}</td>
                        </tr>
                        <tr v-if="tableList.length<=0">
                            <td colspan="6">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { getSongListDetail,getSongDetail } from '../../../api/default.js'
export default {
    name:'song-list-detail',
    data(){
        return {
            tableList:[],
            id:'',
            coverImgUrl:'',
            title:'',
            avatarUrl:'',
            nickname:'',
            subscribedCount:'',
            shareCount:'',
            expertTags:[],
            description:'',
            trackCount:'',
            playCount:'',
            createTime:'',
            songObj:null
        }
    },
    created(){
        this.id = this.$route.query.id;
        if(this.$store.getters.getSongObj){
            let data = this.$store.getters.getSongObj
            this.tableList = data.tracks;
            this.songObj = data;
            this.coverImgUrl = data.coverImgUrl;
            this.avatarUrl = data.creator.avatarUrl;
            this.nickname = data.creator.coverImgUrl;
            this.expertTags = data.creator.expertTags;
            this.shareCount = data.shareCount;
            this.subscribedCount = data.subscribedCount;
            this.description = data.description;
            this.title = data.name;
            this.trackCount = data.trackCount;
            this.playCount = data.playCount;
            this.createTime = data.createTime;
        }else{
            this.getSongList()
        }
    },
    computed:{
        isThisID(){
            return this.$store.getters.getPlaySongListID;
        }
    },
    watch:{
        isThisID(val,oldVal){
            console.log(val,oldVal)
            if(val!=oldVal){
                this.$store.dispatch('saveSongListData',null)
                this.tableList = [],
                this.songObj = null;
                this.coverImgUrl = '';
                this.avatarUrl = '';
                this.nickname = '';
                this.expertTags = [];
                this.shareCount = '';
                this.subscribedCount = '';
                this.description = '';
                this.title = '';
                this.trackCount = '';
                this.playCount = '';
                this.createTime = '';
                this.getSongList()
            }
        }
    },
    methods:{
        playSong(id,index){
            // this.$store.dispatch('savePlaySongData',id)
            this.$store.dispatch('saveTracks',this.tableList)
            this.$emit('changeAudioSrc',{id:id,index:index})
        },
        timeFilter(time){
            let trueTime = Math.floor(time/1000);
            let m = Math.floor(trueTime/60)<10?'0'+Math.floor(trueTime/60):Math.floor(trueTime/60);
            let s = trueTime%60<10?'0'+trueTime%60:trueTime%60;
            return m+':'+s;
        },
        getSongList(){
            getSongListDetail({id:this.id}).then((data)=>{
                if(data.code===200){
                    this.$store.dispatch('saveSongListData',data.data)
                    this.tableList = data.data.tracks;
                    this.songObj = data.data;
                    this.coverImgUrl = data.data.coverImgUrl;
                    this.avatarUrl = data.data.creator.avatarUrl;
                    this.nickname = data.data.creator.coverImgUrl;
                    this.expertTags = data.data.creator.expertTags;
                    this.shareCount = data.data.shareCount;
                    this.subscribedCount = data.data.subscribedCount;
                    this.description = data.data.description;
                    this.title = data.data.name;
                    this.trackCount = data.data.trackCount;
                    this.playCount = data.data.playCount;
                    this.createTime = data.data.createTime;
                }
            })
        },
    }
}
</script>

<style lang="scss">
.song-list-detail{
    padding: 50px;
    border: 1px solid #e5e5e5;
    .song-list-info{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        .left{
            padding: 6px;
            border: 1px solid #e5e5e5;
            img{
                width: 280px;
                height: 280px;
                display: block;
            }
        }
        .right{
            flex:1;
            margin-left: 30px;
            .r-title{
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                .type{
                    display: block;
                    width: 54px;
                    height: 24px;
                    background: url('../../../assets/images/icon.png') no-repeat 0 -243px;
                }
                .title{
                    margin-left: 12px;
                    margin-right: 24px;
                    line-height: 24px;
                    font-size: 20px;
                    font-weight: normal;
                }
                .shu{
                    display: inline-block;
                    height: 32px;
                    width: 1px;
                    background: #ccc;
                    margin: 0 10px;
                }
                .num{
                    font-size: 12px;
                    color: #ccc;
                    i{
                        color: #ccc;
                        display: block;
                        text-align: right;
                    }
                }
            }
            .user-info{
                margin-top: 6px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                -webkit-align-items: center;
                align-items: center;
                .u-img{
                    position: relative;
                    &::before{
                        content: "";
                        position: absolute;
                        right: -4px;
                        bottom: 0;
                        width: 12px;
                        height: 13px;
                        background: url('../../../assets/images/icon.png') no-repeat -65px -840px;
                    }
                }
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: block;
                }
                .name{
                    color: #0c73c2;
                    font-size: 14px;
                    margin-left: 20px;
                }
                .time{
                    font-size: 14px;
                    color: #999;
                    margin-left: 28px;
                }
            }
            .tag{
                margin-top: 20px;
                padding: 8px 0;
                span{
                    cursor: pointer;
                    border: 1px solid #e5e5e5;
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin: 0 6px;
                }
                .play{
                    display: inline-block;
                    width: 20px;
                    height: 18px;
                    position: relative;
                    top: 4px;
                    margin-right: 6px;
                    background: url('../../../assets/images/button2.png') no-repeat 0 -1622px;
                }
                .collect{
                    display: inline-block;
                    width: 20px;
                    height: 24px;
                    overflow: hidden;
                    position: relative;
                    top: 4px;
                    margin-right: 6px;
                    background: url('../../../assets/images/button2.png') no-repeat -8px -978px;
                }
                .share{
                    display: inline-block;
                    width: 20px;
                    height: 18px;
                    position: relative;
                    top: 4px;
                    margin-right: 6px;
                    background: url('../../../assets/images/button2.png') no-repeat -8px -1231px;
                }
                .download{
                    display: inline-block;
                    width: 20px;
                    height: 18px;
                    position: relative;
                    top: 4px;
                    margin-right: 6px;
                    background: url('../../../assets/images/button2.png') no-repeat -8px -2767px;
                }
                span:first-child{
                    color: #fff;
                    margin-left: 0;
                    background: linear-gradient(#0ca3ef, #0c80c2, #0c74c2);
                }
            }
            .label{
                margin-top: 20px;
                .l-tag{
                    span{
                        display: inline-block;
                        padding: 2px 14px;
                        color: #666;
                        font-size: 12px;
                        line-height: 22px;
                        border: 1px solid #d5d5d5;
                        border-radius: 14px;
                        margin: 0 6px;
                    }
                    span:first-child{
                        border: 0;
                        padding: 0;
                    }
                }
                .introduce{
                    font-size: 12px;
                    color: #666;
                    line-height: 24px;
                    // overflow: hidden;
                    // text-overflow:ellipsis;
                    // white-space: nowrap;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;

                }
            }
        }
    }
    .song-list{
        .song-header{
            border-bottom: 2px solid #c20c0c;
            padding: 12px 0;
            h3{
                font-size: 20px;
                color: #333;
            }
        }
        .tabel{
            table{
                thead{
                    tr{

                    }
                    td{
                        padding: 12px 0;
                        color: #909399;
                        background-color: #fff;
                        text-align: center;
                        border-bottom: 1px solid #ebeef5;
                    }
                }
                tbody{
                    tr{
                        &:hover{
                            td{
                                background-color: #f5f7fa;
                                transition: background-color .25s ease;
                            }
                        }
                    }
                    td{
                        padding: 12px 0;
                        color: #909399;
                        background-color: #fff;
                        text-align: center;
                        border-bottom: 1px solid #ebeef5;
                    }
                    .play-song{
                        margin-left: 12px;
                        cursor: pointer;
                        display: block;
                        width: 17px;
                        height: 17px;
                        background: url('../../../assets/images/table.png') no-repeat 0px -103px;
                    }
                }
            }
        }
    }
}
</style>
