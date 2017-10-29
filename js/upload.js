var videoDataToSend = new videoData();
var nextPageToken = "";
var prevPageToken = "";
function nextSearchPage() {
    getVideo(nextPageToken);
    return true;
}
function prevSearchPage() {
    getVideo(prevPageToken);
    return true;
}
// display a searched video to card method
videoData.prototype.display = function () {
var dataToSend = new videoData();
dataToSend = this;
    //column
  var column = document.createElement("div");  // <div class="col-lg-6 col-md-12">
  column.className = "col-lg-6 col-md-12";
    // card
  var card = document.createElement("div");
  card.className = "card padding-thumb";
  //anchor for event
  var anchor = document.createElement("a");
  anchor.addEventListener("click", function() {
      dataToSend.demo();
  });
  anchor.addEventListener("click", takeInfoOfVideo);
  anchor.addEventListener("dragstart", function() {
      dragVideo(event, dataToSend);
  });
  // img
  var img = document.createElement("img");
  img.src = "https://i.ytimg.com/vi/" + this.data.attributes.youtubeId + "/mqdefault.jpg";
  img.style.width = "100%";
  // title
   var title = document.createElement("span");
   title.appendChild(document.createTextNode(this.data.attributes.name));
   anchor.appendChild(img);
   card.appendChild(anchor);
   column.appendChild(card);
   column.appendChild(title);
   document.querySelector("#videos-thumb").appendChild(column);
};
// bind to demo method
videoData.prototype.demo = function () {
    videoDataToSend = this;
    document.querySelector("#demoVideoTab > div > iframe").src = 'https://www.youtube.com/embed/' + this.data.attributes.youtubeId + '?autoplay=1';
    document.querySelector("#demoVideoTab > h5").innerHTML = this.data.attributes.name;
    document.querySelector("#demoVideoTab > button.btn.btn-info").addEventListener("click", autoComplete);
    toDemoVideoTab();
};
// bind value to HTML method
videoData.prototype.bindToForm = function () {
    document.forms["uploadForm"]["youtubeId"].value = this.data.attributes.youtubeId;
    document.forms["uploadForm"]["name"].value = this.data.attributes.name;
    document.forms["uploadForm"]["description"].value = this.data.attributes.description;
    document.forms["uploadForm"]["keywords"].value = this.data.attributes.keywords;
};
//upload method
videoData.prototype.upload = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                var response = JSON.parse(this.responseText);
                console.log(response);
                toastr["success"]("Thêm video vào playlist thành công!");
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("POST", videoApi, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send(JSON.stringify(this));
};
function getVideo(pageToken) {
    var searchQuery = document.getElementById("search-query").value;
    var url = 'https://content.googleapis.com/youtube/v3/search?q=' + searchQuery + '&videoEmbeddable=true&maxResults=4&type=video&videoSyndicated=true&part=snippet&pageToken=' + pageToken +'&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                document.querySelector("nav.row").style.display = "";
                document.querySelector("#videos-thumb").innerHTML = "";
                var response = JSON.parse(this.responseText);
                nextPageToken = response.nextPageToken;
                if (response.prevPageToken !== undefined) {
                    prevPageToken = response.prevPageToken;
                    document.querySelector("#prev-page-btn").classList.remove("disabled");
                }
                else {
                    prevPageToken = "";
                    document.querySelector("#prev-page-btn").classList.add("disabled");
                }
                for (var i=0; i<4; i++) {
                    var video = new videoData(response.items[i].id.videoId, response.items[i].snippet.title, response.items[i].snippet.description, "", "", response.items[i].snippet.thumbnails.medium.url);
                    video.display();
                }
            }
            else {
                console.log(this.responseText);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//drag and drop
function dragVideo(ev, videoObj) {
    ev.dataTransfer.setData("text/plain",JSON.stringify(videoObj));
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    ev.preventDefault();
    var data = JSON.parse(ev.dataTransfer.getData("text"));
    videoDataToSend = new videoData(data.data.attributes.youtubeId, data.data.attributes.name,data.data.attributes.description, data.data.attributes.keywords, data.data.attributes.playlistId, data.data.attributes.thumbnail);
    videoDataToSend.bindToForm();
}

function takeInfoOfVideo() {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoDataToSend.data.attributes.youtubeId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              if (response.pageInfo.totalResults !== 0) {
                  if (response.items[0].snippet.tags !== undefined) {
                      var keywords = JSON.stringify(response.items[0].snippet.tags);
                      keywords = keywords.replace("[", "");
                      keywords = keywords.replace("]", "");
                      videoDataToSend.data.attributes.keywords = keywords;
                  }
                  videoDataToSend.data.attributes.description = response.items[0].snippet.description;
                  videoDataToSend.data.attributes.name = response.items[0].snippet.title;
              }
              else {
                  toastr["error"]("Video này không tồn tại trên hệ thống!");
                  console.log(response);
              }

          }
          else {
              response = JSON.parse(this.responseText);
              toastr["error"]("Video này không tồn tại trên hệ thống!");
              console.log(response);
          }
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function loadUserPlaylist() {
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              var playlistOption;
              for (var i=0; i<response.data.length; i++) {
                  playlistOption = document.createElement("option");
                  playlistOption.value = response.data[i].id;
                  playlistOption.appendChild(document.createTextNode(response.data[i].attributes.name));
                  document.querySelector("#playlist-select select").appendChild(playlistOption);
              }
              $('select').selecty();
          }
          else {
              response = JSON.parse(this.responseText);
              console.log(response);
          }
      }
    };
    xhttp.open("GET", playlistApi, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}
function checkNDemoVideo() {
    videoDataToSend.data.attributes.youtubeId = document.forms["uploadForm"]["youtubeId"].value;
    takeInfoOfVideo();
    setTimeout(function () {
        videoDataToSend.demo();
    },100);

}
function addVideo() {
    var youtubeId = document.forms["uploadForm"]["youtubeId"];
    var videoName = document.forms["uploadForm"]["name"];
    var description = document.forms["uploadForm"]["description"].value;
    var keywords = document.forms["uploadForm"]["keywords"].value;
    var playlistId = document.forms["uploadForm"]["playlistId"].value;
    var thumbnail = "https://i.ytimg.com/vi/" + youtubeId.value + "/mqdefault.jpg";
    var videoAdding = new videoData(youtubeId.value, videoName.value, description, keywords, playlistId, thumbnail);
    console.log(videoAdding);
    if (youtubeId.validity.valid && videoName.validity.valid) {
        videoAdding.upload();
    }

    if (youtubeId.validity.tooShort || youtubeId.validity.tooLong) {
        toastr["warning"]("ID của video chỉ có 11 ký tự");
    }
    else if (youtubeId.validity.patternMismatch) {
        toastr["warning"]("ID video không được có ký tự đặc biệt");
    }
    else if (youtubeId.validity.valueMissing) {
        toastr["warning"]("ID video không được bỏ trống");
    }

    if (videoName.validity.tooShort || videoName.validity.tooLong) {
        toastr["warning"]("Tên video chỉ có 3 đến 50 ký tự");
    }
    else if (videoName.validity.valueMissing) {
        toastr["warning"]("Tên video không được bỏ trống");
    }
}
//some animation
function toDemoVideoTab() {
    document.querySelector("#searchVideoTab").className = "animated zoomOutDown";
    setTimeout(function () {
        document.querySelector("#searchVideoTab").style.display = "none";
        document.querySelector("#demoVideoTab").className = "animated zoomInDown";
        document.querySelector("#demoVideoTab").style.display = "";
    },500);
}
function toSearchVideoTab() {
    document.querySelector("#demoVideoTab").className = "animated zoomOutDown";
    setTimeout(function () {
        document.querySelector("#demoVideoTab").style.display = "none";
        document.querySelector("#searchVideoTab").className = "animated zoomInDown";
        document.querySelector("#searchVideoTab").style.display = "";
        document.querySelector("#demoVideoTab > div > iframe").src = "";
    },500);
}
function autoComplete() {
    videoDataToSend.bindToForm();
}