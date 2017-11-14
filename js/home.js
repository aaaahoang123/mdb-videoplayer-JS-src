var pageToken = "";
var searchQuery = "";
//create videoData Object

//Global object to upload video
var videoDataToSend = new videoData();
//display method
videoData.prototype.display = function () {
    var dataVideoToPlay = this.data.attributes;
    var videoCard = document.createElement("div");
    videoCard.className = "col-lg-4 col-md-6 col-sm-6 animated fadeIn";
    videoCard.style.overflow = "hidden";
    videoCard.style.textOverflow = "ellipsis";
    // card
    var card = document.createElement("div");
    card.className = "card";
    // view
    var view = document.createElement("div");
    view.className = "view overlay waves-effect waves-light z-depth-1";
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
    anchorPlayer.addEventListener('dragstart', function (event) {
        dragVideo(event, dataVideoToPlay);
    });
    anchorPlayer.setAttribute("draggable", "true");
    // mask
    var mask = document.createElement("div");
    mask.className = "mask flex-center";
    // play icon
    var playIcon = document.createElement("i");
    playIcon.className = "fa fa-play-circle-o fa-3x white-text";
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
  this.pUploadVideo({
     success: function (response) {
         toastr["success"]("Thêm video vào playlist thành công!");
     },
     error: function (response) {
         toastr["warning"]("Đã xảy ra lỗi, vui lòng inspect logs và báo cho chúng tôi");
         console.log(response);
     }
  });
};
//Get video From YouTube
function getVideoFromYoutube(search) {
    if (search === true) {
        pageToken = '';
    }
    document.querySelector("#see-more-video-btn").setAttribute("disabled", "true");
    document.querySelectorAll("#see-more-video-btn i")[0].style.display = "none";
    document.querySelectorAll("#see-more-video-btn i")[1].style.display = "";
    var url = 'https://content.googleapis.com/youtube/v3/search?q=' + searchQuery + '&videoEmbeddable=true&maxResults=12&type=video&videoSyndicated=true&part=snippet&pageToken=' + pageToken +'&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          var videosArray = response.items;
          pageToken = response.nextPageToken;
          setTimeout(function () {
              for (var i=0; i<videosArray.length; i++) {
                  var video = new videoData(videosArray[i].id.videoId, videosArray[i].snippet.title, videosArray[i].snippet.description, "", "", videosArray[i].snippet.thumbnails.medium.url);
                  video.display();
              }
              toastr["info"]("Đã load xong video!");
              document.querySelectorAll("#see-more-video-btn i")[0].style.display = "";
              document.querySelectorAll("#see-more-video-btn i")[1].style.display = "none";
              document.querySelector("#see-more-video-btn").removeAttribute("disabled");
          }, 200);

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
    getVideoFromYoutube(true);
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
    document.querySelector("#watch-video-detail").href = "pages/watch.html?yid=" + videoData.youtubeId;
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
            var playlistCard = document.querySelector("#playlist-tab");
            var listPlaylistToAdd = document.querySelector("section#modalYT > div > div > div > div.dropdown > div.dropdown-menu");
            // Bind playlist img to left aside card
            if (playlistArray !== undefined) {
                for (var i=playlistArray.length-1; i>=0 && i >= playlistArray.length-3; i--) {
                    bindPlaylistToSide(playlistArray[i], playlistCard);
                    if (i !== 0 && i !== playlistArray.length-3) {
                        playlistCard.appendChild(document.createElement("hr"));
                    }
                }
                for (i=0; i<playlistArray.length; i++) {
                    bindPlaylistToModal(playlistArray[i], listPlaylistToAdd);
                }
            }
            else {
                $('#sticky-playlist-tabs > div > ul > li > a[href="#add-playlist-tab"]').tab('show');
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
function bindPlaylistToSide(playlist, e) {
    var playlistId = playlist.id;
    // row
    var row = document.createElement("div");
    row.className = "row padding-thumb animated fadeIn";
    row.addEventListener("dragover", function (event) {                                                  //1. <div class="row shadow-box" ondragover="allowDrop(event)"
        allowDrop(event);                                                                            // ondrop="drop(event, playlistId)">
    });
    row.setAttribute("ondrop", 'drop(event,' + playlistId + ')');
    // thumb
    var thumb = document.createElement("a");                                                              //2L. <a class="col-md-4 col-sm-6 responsive-background"
    thumb.href = "pages/watch.html?plid=" + playlistId;
    thumb.className = "col-md-4 col-sm-6 responsive-background";                                           // style="background-image: url(playlistArray[i].attributes.thumbnailUrl)">
    thumb.style.backgroundImage = "url(" + playlist.attributes.thumbnailUrl + ")";

    // info
    var info = document.createElement("div");                                                              //2R. <div class="col-md-8 col-sm-6">
    info.className = "col-md-8 col-sm-6";
    info.style.paddingTop = "5px";
    // plName link
    var plNameLink = document.createElement("a");                                                               //2R > 3. <a>
    plNameLink.className = "grey-text";
    plNameLink.href = "pages/watch.html?plid=" + playlistId;
    //pl Name
    var plName = document.createElement("h5");
    plName.appendChild(document.createTextNode(playlist.attributes.name));                                  //2R > 3 > 4.1 <h5>playlistArray[i].attributes.name</h5>
    plNameLink.appendChild(plName);
    var plDescription = document.createElement("p");                                                                 //2R > 3 > 4.2 <p>playlistArray[i].attributes.description</p>
    plDescription.appendChild(document.createTextNode(playlist.attributes.description));
    // info.appendChild(document.createElement("br"));
    info.appendChild(plNameLink);
    info.appendChild(plDescription);
    row.appendChild(thumb);
    row.appendChild(info);
    // append to View
    e.appendChild(row);
}
// Bind playlist to Modal
function bindPlaylistToModal(pl, e) {
    var playlistId = pl.id;
    var playlist = document.createElement("a");
    playlist.className = "dropdown-item";
    playlist.appendChild(document.createTextNode(pl.attributes.name));
    playlist.setAttribute("onclick", "addVideoToPlaylist(" + playlistId + ")");
    e.appendChild(playlist);
}
// Add more playlist
function addPlaylist() {
    var name = document.querySelector("#playlist-name");
    var description = document.querySelector("#playlist-description");
    var thumbnail = document.querySelector("#playlist-thumbnail");
    if (name.validity.valueMissing) {
        toastr["warning"]("Tên playlist không được để trống");
    }
    else if (name.validity.tooShort) {
        toastr["warning"]("Tên playlist có ít nhất 7 ký tự");
    }
    else {
        var newPlaylist = new playlistData(name.value, description.value, thumbnail.value);
        newPlaylist.sendPlaylist();
        document.querySelectorAll("#add-playlist-btn i")[0].style.display = "none";
        document.querySelectorAll("#add-playlist-btn i")[1].style.display = "";
        document.querySelector("#add-playlist-btn").setAttribute("disabled", "true");
        if (newPlaylist.xhttp.status === 201) {
            var response = JSON.parse(newPlaylist.xhttp.responseText).data;
            setTimeout(function () {
                document.querySelector("#playlist-tab").appendChild(document.createElement("hr"));
                bindPlaylistToSide(response, document.querySelector("#playlist-tab"));
                bindPlaylistToModal(response, document.querySelector("section#modalYT > div > div > div > div.dropdown > div.dropdown-menu"));
                $(function () {
                    $('#sticky-playlist-tabs > div > ul > li > a[href="#playlist-tab"]').tab('show');
                });
                document.querySelector("#playlist-name").value = "";
                document.querySelector("#playlist-description").value = "";
                document.querySelector("#playlist-thumbnail").value = "";
                document.querySelectorAll("#add-playlist-btn i")[0].style.display = "";
                document.querySelectorAll("#add-playlist-btn i")[1].style.display = "none";
                document.querySelector("#add-playlist-btn").removeAttribute("disabled");
                toastr["success"]("Thêm playlist thành công");
            }, 300);
        }
        else {
            response = JSON.parse(newPlaylist.xhttp.responseText);
            console.log(response);
            toastr["error"]("Đã xảy ra lỗi. Vui lòng inspect logs và báo cho chúng tôi");
        }
    }
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
                var carouselItemsThumb = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a div.view");
                var carouselItemsIMG = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a div img");
                var carouselItemsTitle = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a div h4");
                var crouselItemsAnchor = document.querySelector("#carousel-top-trend div").querySelectorAll("div.carousel-item a");
                for (var i=0; i<videoArray.length; i++) {
                    if (videoArray[i].snippet.thumbnails.maxres !== undefined) {
                        carouselItemsIMG[i].src = videoArray[i].snippet.thumbnails.maxres.url;
                        carouselItemsThumb[i].classList.remove("thumb");
                    }
                    else if (videoArray[i].snippet.thumbnails.standard !== undefined) {
                        carouselItemsIMG[i].src = videoArray[i].snippet.thumbnails.standard.url;
                    }
                    else {
                        carouselItemsIMG[i].src = videoArray[i].snippet.thumbnails.high.url;
                    }
                    carouselItemsIMG[i].alt = videoArray[i].snippet.title;
                    carouselItemsTitle[i].innerHTML = videoArray[i].snippet.title;
                    crouselItemsAnchor[i].href = "pages/watch.html?yid=" + videoArray[i].id;
                    crouselItemsAnchor[i].title = videoArray[i].snippet.title;
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
                  document.querySelector("#new-video-card > div > div > a").href = "pages/watch.html?plid=" + response.data[0].attributes.playlistId + "&cid=" + response.data[0].id;
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

$(document).ready(function () {
    getVideoFromYoutube();
    loadTopTrendingVideo();
    if (userToken !== null) {
        loadUserPlaylist();
        document.getElementById("sticky-playlist-tabs").style.display = "inherit";
        document.querySelector("section#modalYT > div > div > div > div.dropdown").style.display = "";
        getNewAddVideo();
    }
    else {
        document.querySelector("#new-video-card > div > div > a > div > img").src = "http://1.bp.blogspot.com/-SRdKauDRBg4/T3pVgdOxgAI/AAAAAAAAAZs/-QxJ9qdb8FI/s640/undefined_01.jpg";
        document.querySelector("#new-video-card > div > div > a > div > img").alt = "Chưa có video";
        document.querySelector("#new-video-card > div > div > a > div > p").innerHTML = "Không có video mới! Bạn chưa đăng nhập hoặc chưa từng upload video";
    }
});