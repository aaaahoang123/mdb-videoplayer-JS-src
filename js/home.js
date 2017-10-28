var pageToken = "";
var searchQuery = "";
function getVideoFromYoutube() {
    var url = 'https://content.googleapis.com/youtube/v3/search?q=' + searchQuery + '&videoEmbeddable=true&maxResults=12&type=video&videoSyndicated=true&part=snippet&pageToken=' + pageToken +'&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          var videosArray = response.items;
          pageToken = response.nextPageToken;
          for (var i=0; i<videosArray.length; i++) {
              // column card
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
                thumb.src = videosArray[i].snippet.thumbnails.medium.url;
                thumb.style.width = "100%";
                thumb.alt = videosArray[i].snippet.title;
                // anchor player
                var anchorPlayer = document.createElement("a");
                anchorPlayer.setAttribute('onclick', 'return playVideo(\"' + videosArray[i].id.videoId+ '\")');
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
                titleLink.href = "#";
                titleLink.className = "grey-text";
                //title
                var title = document.createElement("h6");
                title.appendChild(document.createTextNode(videosArray[i].snippet.title));
                // append the title
                titleLink.appendChild(title);
                // complete the card
                videoCard.appendChild(card);
                videoCard.appendChild(titleLink);
                // append to screen
                document.getElementById("youtubeVideoView").appendChild(videoCard);
          }
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
// play video within modal
function playVideo(id) {
    document.querySelector("#modalYT").classList.remove("fadeOut");
    document.querySelector("#modalYT").classList.add("fadeIn");
    document.querySelector("#modalYT div div div div iframe").src = "https://www.youtube.com/embed/" + id;
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
    },500);

}
function loadUserPlaylist() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var playlistArray = JSON.parse(this.response).data;
            var carouselItems = document.querySelector("#sticky-playlist-card div div").querySelectorAll("a");
            var carouselIndicators = document.querySelector("#sticky-playlist-card ol").querySelectorAll("li div");
            for (var i=0; i<playlistArray.length && i<carouselItems.length; i++) {
                carouselItems[i].style.backgroundImage = 'url(' + playlistArray[i].attributes.thumbnailUrl + ')';
                carouselItems[i].style.display = "";
                carouselIndicators[i].style.display = "";
                carouselIndicators[i].style.backgroundImage = 'url(' + playlistArray[i].attributes.thumbnailUrl + ')';
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            console.log(this.response);
        }
    }
    xhttp.open("GET", playlistApi);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}

