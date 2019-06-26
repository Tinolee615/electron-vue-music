<template>
    <div class="home-page">
        <div class="mySwiper">
            <swiper :options="swiperOption">
                <swiper-slide><img src="https://imgessl.kugou.com/commendpic/20190109/20190109104215314555.jpg"></swiper-slide>
                <swiper-slide><img src="https://imgessl.kugou.com/commendpic/20190109/20190109104155147376.jpg"></swiper-slide>
                <swiper-slide><img src="https://imgessl.kugou.com/commendpic/20190611/20190611101938392990.jpg"></swiper-slide>
                <swiper-slide><img src="https://imgessl.kugou.com/commendpic/20190619/20190619175131857155.jpg"></swiper-slide>
                <swiper-slide><img src="https://imgessl.kugou.com/commendpic/20190619/20190619234628493633.jpg"></swiper-slide>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
        </div>
        <div class="songList mW">
            <div class="title">
                <i></i>
                <h3>精品歌单</h3>
            </div>
            <ul>
                <li v-for="(item,index) in songList" :key="index">
                    <div class="img" @click="lookSongList(item.id)">
                        <img :src="item.coverImgUrl" alt="">
                        <div class="bottom">
                            <a href="javascript:void(0);" title="播放"></a>
                            <span class="icon-headset"></span>
                            <span class="num">{{item.playCount}}</span>
                        </div>
                    </div>
                    <p>{{item.name}}</p>
                </li>
                <li v-for="(item,index) in (4-hotSongList.length%4)" :key="index" class="occupied"></li>
            </ul>
        </div>
        <div class="songList mW">
            <div class="title">
                <i></i>
                <h3>热门歌单</h3>
            </div>
            <ul>
                <li v-for="(item,index) in hotSongList" :key="index">
                    <div class="img" @click="lookSongList(item.id)">
                        <img :src="item.coverImgUrl" alt="">
                        <div class="bottom">
                            <a href="javascript:void(0);" title="播放"></a>
                            <span class="icon-headset"></span>
                            <span class="num">{{item.playCount}}</span>
                        </div>
                    </div>
                    <p>{{item.name}}</p>
                </li>
                <li v-for="(item,index) in (4-hotSongList.length%4)" :key="index" class="occupied"></li>
            </ul>
        </div>
    </div>
</template>

<script>
import { getHighQualityList,getHotSongList } from '../../../api/default.js'
export default {
    name:'home-page',
    data(){
        return{
            swiperOption: {//swiper3
                autoplay: 1000,
                speed: 1000,
                loop:true,
                navigation: {
                    nextEl: '.swiper-button-next', //前进按钮的css选择器或HTML元素。
                    prevEl: '.swiper-button-prev', //后退按钮的css选择器或HTML元素。
                    hideOnClick: true, //点击slide时显示/隐藏按钮
                    disabledClass: 'my-button-disabled', //前进后退按钮不可用时的类名。
                    hiddenClass: 'my-button-hidden', //按钮隐藏时的Class
                },
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    //type: 'fraction',
                    //type : 'progressbar',
                    //type : 'custom',
                    paginationHide:false,
                    progressbarOpposite: true, //使进度条分页器与Swiper的direction参数相反
                    bulletElement : 'li', //设定分页器指示器（小点）的HTML标签。
                    dynamicBullets: true,  //动态分页器，当你的slide很多时，开启后，分页器小点的数量会部分隐藏。
                    dynamicMainBullets: 2, //动态分页器的主指示点的数量
                    // hideOnClick: true, //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器。
                    clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                },
            },
            songList:[],
            hotSongList:[]
        }
    },
    created(){
        this.songList = this.$store.getters.getHigtData;
        this.hotSongList = this.$store.getters.getHotData;
        if(this.songList.length<=0){
            this.getHighQuality()
        }
        if(this.hotSongList.length<=0){
            this.getHotSongList()
        }
    },
    methods:{
        lookSongList(id){
            if(id!=this.$store.getters.getPlaySongListID){
                this.$store.dispatch('savePlaySongListData',id)
            }
            this.$router.push({path:'/songList',query:{id:id}})
        },
        getHighQuality(){
            getHighQualityList().then((data)=>{
                if(data.code===200){
                    this.$store.dispatch('saveHomeHigtData',data.data)
                    this.songList = data.data;
                }
            })
        },
        getHotSongList(){
            getHotSongList().then((data)=>{
                if(data.code===200){
                    this.$store.dispatch('saveHomeHotData',data.data)
                    this.hotSongList = data.data;
                }
            })
        }
    }
}
</script>

<style lang="scss">
.home-page{
    margin-bottom: 80px;
}
.mySwiper{
    background: url('../../../assets/images/mainbg.jpg');
    .swiper-slide{
        height: 449px;
        position: relative;
        overflow: hidden;
    }
    .swiper-button-prev{
        left: 50px;
    }
    .swiper-button-next{
        right: 50px;
    }
    img{
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
    }
}
.songList{
    .title{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        padding: 6px 0;
        border-bottom: 2px solid #C10D0C;
        i{
            display: block;
            width: 8px;
            height: 8px;
            border: 5px solid #C10D0C;
            border-radius: 50%;
        }
        h3{
            margin-left: 12px;
            font-size: 20px;
            color: #333;
        }
    }
    ul{
        margin-top: 12px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        flex-wrap: wrap;
        li{
            margin: 12px;
            width: 160px;
            height: 204px;
            padding: 18px 24px;
            box-shadow: 0 0.1em 0.2em 0.1em #e5e5e5;
            cursor: pointer;
            img{
                display: block;
                width: 160px;
                height: 160px;
            }
            p{
                font-size: 12px;
                color: #333;
                line-height: 18px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
        }
        .occupied{
            box-shadow: none;
        }
        .img{
            position: relative;
            .bottom{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 27px;
                background: rgba(0, 0, 0, .3);
                color: #ccc;
                padding: 3px 0;
                box-sizing: border-box;
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                -webkit-align-items: center;
                align-items: center;
                a{
                    position: absolute;
                    right: 10px;
                    bottom: 5px;
                    width: 16px;
                    height: 17px;
                    background-position: 0 0;
                    background: url('../../../assets/images/iconall.png') no-repeat;
                }
                .icon-headset{
                    margin: 0 8px;
                    width: 14px;
                    height: 11px;
                    background: url('../../../assets/images/iconall.png') no-repeat 0 -24px;
                }
                .num{
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
