var pageToken = "";
var searchQuery = "";
//create videoData Object

//Global object to upload video
var videoDataToSend = new videoData();
//display method
videoData.prototype.display = function () {
    var dataVideoToPlay = this.data.attributes;
    var videoCard = document.createElement("div");
    videoCard.className = "col-lg-4 col-md-6 col-sm-6";
    videoCard.style.overflow = "hidden";
    videoCard.style.textOverflow = "ellipsis";
    // card
    var card = document.createElement("div");
    card.className = "card";
    // view
    var view = document.createElement("div");
    view.className = "view overlay waves-effect waves-light";
    // thumb
    var thumb = document.createElement("img");
    thumb.className = "img-fluid";
    thumb.src = this.data.attributes.thumbnail;
    thumb.style.width = "100%";
    thumb.alt = this.data.attributes.name;
    // anchor player

    var anchorPlayer = document.createElement("a");
    anchorPlayer.addEventListener('click', function() {
        playVideo(dataVideoToPlay);
    });
    anchorPlayer.addEventListener('dragstart', function () {
        dragVideo(event, dataVideoToPlay);
    });
    anchorPlayer.setAttribute("draggable", "true");
    // mask
    var mask = document.createElement("div");
    mask.className = "mask flex-center";
    // play icon
    var playIcon = document.createElement("i");
    playIcon.className = "fa fa-play-circle fa-3x green-text";
    // append the thumbnail
    mask.appendChild(playIcon);
    anchorPlayer.appendChild(mask);
    view.appendChild(thumb);
    view.appendChild(anchorPlayer);
    card.appendChild(view);
    // title link
    var titleLink = document.createElement("a");
    titleLink.className = "grey-text";
    titleLink.addEventListener('click', function() {
        playVideo(dataVideoToPlay);
    });
    //title
    var title = document.createElement("h6");
    title.appendChild(document.createTextNode(this.data.attributes.name));
    // append the title
    titleLink.appendChild(title);
    // complete the card
    videoCard.appendChild(card);
    videoCard.appendChild(titleLink);
    // append to screen
    document.getElementById("youtubeVideoView").appendChild(videoCard);
};
//Upload Video
videoData.prototype.quickUploadVideo = function (playlistId) {
  this.data.attributes.playlistId = playlistId;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
     if (this.readyState === 4) {
         if (this.status === 201) {
             resp = JSON.parse(this.responseText);
             toastr["success"]("Thêm video vào playlist thành công!");
         }
         else {
             console.log(this.responseText);
         }
     }
  };
  xhttp.open("POST", videoApi, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
  xhttp.send(JSON.stringify(this));
};
//Get video From YouTube
function getVideoFromYoutube() {
    var url = 'https://content.googleapis.com/youtube/v3/search?q=' + searchQuery + '&videoEmbeddable=true&maxResults=12&type=video&videoSyndicated=true&part=snippet&pageToken=' + pageToken +'&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          var videosArray = response.items;
          pageToken = response.nextPageToken;
          for (var i=0; i<videosArray.length; i++) {
                var video = new videoData(videosArray[i].id.videoId, videosArray[i].snippet.title, "", videosArray[i].snippet.description, "", videosArray[i].snippet.thumbnails.medium.url);
                video.display();
          }
          toastr["info"]("Đã load xong video!");
      }
      else if (this.readyState === 4 && this.status !== 200) {
          var response = JSON.parse(this.responseText);
          console.log(response);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
// search video
function searchVideo() {
    searchQuery = document.querySelector("#search-query").value;
    document.getElementById("youtubeVideoView").innerHTML = "";
    getVideoFromYoutube();
}
// enter to search video
function enterToSearch(event) {
    if (event.which === 13 || event.keyCode === 13) {
        searchVideo();
    }
}
// play video within modal, and make the DataToSend ready
function playVideo(videoData) {
    document.querySelector("#modalYT").classList.remove("fadeOut");
    document.querySelector("#modalYT").classList.add("fadeIn");
    document.querySelector("#modalYT div div div div iframe").src = "https://www.youtube.com/embed/" + videoData.youtubeId;
    videoDataToSend.data.attributes = videoData;
    setTimeout(function () {
        $("#modalYT").modal('show');
    }, 100);
    return true;
}

// close and clear modal
function closeVideoModal() {
    document.querySelector("#modalYT").classList.remove("fadeIn");
    document.querySelector("#modalYT").classList.add("fadeOut");
    setTimeout(function () {
        $("#modalYT").modal('hide');
        document.querySelector("#modalYT div div div div iframe").src = "";
    },100);

}

function loadUserPlaylist() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var playlistArray = JSON.parse(this.response).data;
            var playlistCard = document.querySelector("#sticky-playlist-card");
            var listPlaylistToAdd = document.querySelector("section#modalYT > div > div > div > div.dropdown > div.dropdown-menu");
            // Bind playlist img to left aside card
            if (playlistArray !== undefined) {
                for (var i=0; i<playlistArray.length && i<3; i++) {
                    playlistId = playlistArray[i].id;
                    // row
                    var row = document.createElement("div");
                    row.className = "row shadow-box";
                    row.addEventListener("dragover", function () {                                                  //1. <div class="row shadow-box" ondragover="allowDrop(event)"
                        allowDrop(event);                                                                            // ondrop="drop(event, playlistId)">
                    });
                    row.setAttribute("ondrop", 'drop(event,' + playlistId + ')');
                    // thumb
                    var thumb = document.createElement("a");                                                               //2L. <a class="col-md-4 col-sm-6 responsive-background"
                    thumb.className = "col-md-4 col-sm-6 responsive-background";                                           // style="background-image: url(playlistArray[i].attributes.thumbnailUrl)">
                    thumb.style.backgroundImage = "url(" + playlistArray[i].attributes.thumbnailUrl + ")";

                    // info
                    var info = document.createElement("div");                                                              //2R. <div class="col-md-8 col-sm-6">
                    info.className = "col-md-8 col-sm-6";
                    // plName link
                    var plNameLink = document.createElement("a");                                                               //2R > 3. <a>
                    //pl Name
                    var plName = document.createElement("h5");
                    plName.appendChild(document.createTextNode(playlistArray[i].attributes.name));                                  //2R > 3 > 4.1 <h5>playlistArray[i].attributes.name</h5>
                    plNameLink.appendChild(plName);
                    var plDescription = document.createElement("p");                                                                 //2R > 3 > 4.2 <p>playlistArray[i].attributes.description</p>
                    plDescription.appendChild(document.createTextNode(playlistArray[i].attributes.description));
                    // info.appendChild(document.createElement("br"));
                    info.appendChild(plNameLink);
                    info.appendChild(plDescription);
                    row.appendChild(thumb);
                    row.appendChild(info);
                    // append to View
                    playlistCard.appendChild(row);
                }
                for (i=0; i<playlistArray.length; i++) {
                    playlistId = playlistArray[i].id;
                    var playlist = document.createElement("a");
                    playlist.className = "dropdown-item";
                    playlist.appendChild(document.createTextNode(playlistArray[i].attributes.name));
                    playlist.setAttribute("onclick", "addVideoToPlaylist(" + playlistId + ")");
                    listPlaylistToAdd.appendChild(playlist);
                }
            }

        }
        else if (this.readyState === 4 && this.status !== 200) {
            console.log(this.response);
        }
    };
    xhttp.open("GET", playlistApi);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}
// add Video function for each playlist select
function addVideoToPlaylist(playlistId) {
    videoDataToSend.quickUploadVideo(playlistId);
}
// Top trending for Slideshow
function loadTopTrendingVideo() {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=3&regionCode=VN&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                var videoArray = response.items;
                var carouselItemsIMG = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a div img");
                var carouselItemsTitle = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a div h3");
                for (var i=0; i<videoArray.length; i++) {
                    carouselItemsIMG[i].src = "https://i.ytimg.com/vi/" + videoArray[i].id + "/hqdefault.jpg";
                    carouselItemsTitle[i].innerHTML = videoArray[i].snippet.title;
                }
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
function getNewAddVideo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              if (response.data !== undefined) {
                  document.querySelector("#new-video-card > div > div > a > div > img").src = "https://i.ytimg.com/vi/" + response.data[0].attributes.youtubeId + "/mqdefault.jpg";
                  document.querySelector("#new-video-card > div > div > a > div > img").alt = response.data[0].attributes.name;
                  document.querySelector("#new-video-card > div > div > a > div > p").innerHTML = response.data[0].attributes.name;
              }
              else {
                  document.querySelector("#new-video-card > div > div > a > div > img").src = "http://1.bp.blogspot.com/-SRdKauDRBg4/T3pVgdOxgAI/AAAAAAAAAZs/-QxJ9qdb8FI/s640/undefined_01.jpg";
                  document.querySelector("#new-video-card > div > div > a > div > img").alt = "Chưa có video";
                  document.querySelector("#new-video-card > div > div > a > div > p").innerHTML = "Không có video mới! Bạn chưa đăng nhập hoặc chưa từng upload video";
              }
          }
          else {
              response = JSON.parse(this.responseText);
              console.log(response);
          }
      }
    };
    xhttp.open("GET", videoApi + "?page=1&limit=1", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}
//drag and drop
function dragVideo(ev, videoObj) {
    ev.dataTransfer.setData("text/plain",JSON.stringify(videoObj));
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev, playlistId) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    videoDataToSend.data.attributes = JSON.parse(data);
    videoDataToSend.quickUploadVideo(playlistId);
}