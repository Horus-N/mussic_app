
const $=document.querySelector.bind(document);
const $$= document.querySelectorAll.bind(document);
const heading =$('.header h2');
const cdThumb=$('.cd-thumb');
const audio=$('#audio');
const cd=$('.cd');
const playBtn=$('.btn-toggle-play')
const player =$('.dashboard')
const progress=$('#progress')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const playList=$('.playList');
console.log(repeatBtn)


const app={
    currenIndex:0,
    isPlaying:false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name:'Hãy trao cho anh',
            singer:'Sơn Tùng',
            path:'./music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3',
            image:'./img/haytraochoanh.jpg'
        },
        {
            name:'À Lôi',
            singer:'Double2t',
            path:'./music/ALoi-Double2TMasew-10119691.mp3',
            image:'./img/aloi.jpg'
        },
        {
            name:'2 phút hơn',
            singer:'Pháo',
            path:'./music/2PhutHonKAIZRemix-Phao-6833481.mp3',
            image:'./img/twophuthon.jpg'
        },
        {
            name:'Ai mang cô đơn đi',
            singer:'Hương Ly- Cover',
            path:'./music/AiMangCoDonDiTanThoRemixCover-HuongLy-6812806.mp3',
            image:'./img/aimangcodondi.jpg'
        },
        {
            name:'Anh từng cố gắng',
            singer:'Nhật Phong',
            path:'./music/AnhTungCoGangACVRemix-NhatPhong-6847167.mp3',
            image:'./img/anhtungcogang.jpg'
        },
        {
            name:'Không phải dạng vừa đâu',
            singer:'Sơn Tùng',
            path:'./music/KhongPhaiDangVuaDau-SonTungMTP-3753840.mp3',
            image:'./img/khongphaidangvuadau.jpg'
        },
        {
            name:'Lạc trôi',
            singer:'Sơn Tùng',
            path:'./music/LacTroiTripleDRemix-SonTungMTP-5164670.mp3',
            image:'./img/lactroi.jpg'
        },
        {
            name:'Ngôi nhà hoa hồng',
            singer:'DJBibo',
            path:'./music/NgoiNhaHoaHongMoiNguoiMotNoiBiBoRemix-DJBibo-6891279.mp3',
            image:'./img/ngoinhahoahong.jpg'
        },
        {
            name:'Niu Duyên',
            singer:'Lê Bảo Bình',
            path:'./music/NiuDuyenKproxRemix-LeBaoBinh-6927034.mp3',
            image:'./img/niuduyen.jpg'
        },
        {
            name:'Remember me',
            singer:'Sơn Tùng',
            path:'./music/UpgradeRememberMe-SonTungMTP-4263862.mp3',
            image:'./img/tunit.jpg'
        },
    ],

    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index===this.currenIndex?'active':''}" data-index="${index}" >
                <div class="thumb" style="background-image: url('${song.image}');">

                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">
                        ${song.singer}
                    </p>
                </div>

                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML=htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currenIndex]
            }
        })
    },

    handleEvents: function(){
        const cdWidth = cd.offsetWidth

        // Xử lý Cd quay /dừng
        const cdThumbAnimate=cdThumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
            duration: 10000 ,//10 seconds
            iterations:Infinity // chaỵ bao nhiêu lần
        })

        cdThumbAnimate.pause();
        // Xử lý phóng to thu nhỏ cd
        window.onscroll=function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth=cdWidth - scrollTop;
            cd.style.width= newCdWidth>0 ?newCdWidth + 'px':0;
            cd.style.opaciti=newCdWidth/cdWidth
        }

        // Xử lý khi click play

        playBtn.onclick = function(){
            if(app.isPlaying){
                app.isPlaying=false;
                audio.pause();
                player.classList.remove('pause')
                cdThumbAnimate.pause();
            }else{
                audio.play();
                cdThumbAnimate.play();
            }    
        }

        // khi song được play
        audio.onplay=function(){
            app.isPlaying=true;
            player.classList.add('pause')
        }

        // khi song bị paause 
        audio.onpause=function(){
            app.isPlaying=false;
            player.classList.remove('pause')
        }

        // khi tiến độ bìa hát thay đổi 
        audio.ontimeupdate = function (){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime/audio.duration *100)
                progress.value=progressPercent
            }
        }

        // Xử lý khi tua xong 
        progress.onchange=function(e){
           const seekTime=audio.duration/100*e.target.value;
           audio.currentTime=seekTime;
        }

        // khi next song

        nextBtn.onclick=function(){
            if(app.isRandom){
                app.playRandomsong();
            }else{
            app.nextsong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()

            
        }

        // khi prev song

        prevBtn.onclick=function(){
            if(app.isRandom){
                app.playRandomsong();
            }else{
            app.prevsong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()

        }

        // xu ly random bat / tat
        randomBtn.onclick = function(){
            app.isRandom=!app.isRandom;

            randomBtn.classList.toggle('active',app.isRandom)
            
        }

        // xử lý lặp lại một song

        repeatBtn.onclick=function(){
            app.isRepeat=!app.isRepeat;
            repeatBtn.classList.toggle('active',app.isRepeat)
            
        }

        // xử lý next song khi audio ended

        audio.onended=function(){
            if(app.isRepeat){
                audio.play()
            }else
           nextBtn.click()
        }

        // Lắng nghe hành vi click vào playList

        playList.onclick=e=>{
            const songNote=e.target.closest('.song:not(.active');
            if( songNote|| e.target.closest('.option')){
                
                app.currenIndex=Number(songNote.getAttribute('data-index'));
                app.loadCurrenSong();
                app.render();
                audio.play();

            }
        }
    },
    scrollToActiveSong: function(){

        
        
            setTimeout(()=>{
                
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'center'
                  
                },300)
            })
    },
    loadCurrenSong: function(){
        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url(${this.currentSong.image})`
        audio.src=this.currentSong.path
    },

    nextsong:function(){
        this.currenIndex++
        if(this.currenIndex>=this.songs.length){
            this.currenIndex=0
        }
        this.loadCurrenSong();
    },

    prevsong:function(){
        this.currenIndex--;
        if(this.currenIndex<0){
            this.currenIndex=this.songs.length-1
        }
        this.loadCurrenSong();
    },

    playRandomsong:function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random() *this.songs.length)
        } while(newIndex===this.currenIndex)
        this.currenIndex=newIndex
        this.loadCurrenSong()
    },

    start: function(){
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe/ xử lý các sự kiện(Dom events)        
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrenSong();
        // Render playlist
        this.render()
    }
}

console.log('hello')
app.start();