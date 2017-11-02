if (userToken === null) {
    $("#alert-modal").modal();
}
else {
    document.querySelector("main.container").style.display = "";
}
var playlistArray = new Array();
function loadNBindPlaylist() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
            var response = JSON.parse(this.responseText).data;
            if (response !== undefined) {
                playlistArray = response;
                for (var i=0; i<response.length; i++) {
                    bindPlaylist(response[i]);
                }
            }
            else {

            }
        }
        else {

        }
      }
    };
    xhttp.open("GET", playlistApi, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}

function bindPlaylist(playlist) {
    var column = document.createElement("div");                             // <div class="col-lg-4 col-md-6 col-sm-6 padding-thumb">
    column.className = "col-lg-4 col-md-6 col-sm-6 padding-thumb";
    column.id = playlist.id;                                                                        //         <!--Card-->
    var card = document.createElement("div");                             //         <div class="card">
    card.className = "card";
                                                                            //         <!--Card image-->
    var cardImage = document.createElement("div");                                  //     <div class="view overlay hm-white-slight">
    cardImage.className = "view overlay hm-white-slight";

    var playlistThumb = document.createElement("div");                              //         <div class="playlist-thumb" style="background-image: url(http://admin.adcbook.net.vn//files/products/0H920.jpg);"></div>
    playlistThumb.className = "playlist-thumb";
    playlistThumb.style.backgroundImage = 'url(' + playlist.attributes.thumbnailUrl + ')';

    var playlistMask = document.createElement("a");                                //         <a> <div class="mask" onclick="loadVideoByPlaylistId()"></div> </a>
    playlistMask.addEventListener('click', function () {
        loadVideoByPlaylistId(playlist.id);
    });
    playlistMask.addEventListener('click', function() {
        showVideoInPlTab(playlist.attributes.name, playlist.id)
    });
    var maskContent = document.createElement("div");                                    //</div> <!--/.Card image-->
    maskContent.className = "mask waves-effect waves-light";
    playlistMask.appendChild(maskContent);
    cardImage.appendChild(playlistThumb);
    cardImage.appendChild(playlistMask);
    card.appendChild(cardImage);
                                                                                    //         <!--Button-->
    var button = document.createElement("a");                                 //         <a class="btn-floating btn-action"><i class="fa fa-chevron-right"></i></a>
    button.className = "btn-floating btn-action waves-effect waves-light";
    button.addEventListener('click', function () {
        loadVideoByPlaylistId(playlist.id);
    });
    button.addEventListener('click', function() {
        showVideoInPlTab(playlist.attributes.name, playlist.id)
    });
    var btnIcon = document.createElement("i");
    btnIcon.className = "fa fa-chevron-right";
    button.appendChild(btnIcon);
    card.appendChild(button);
                                                                                        //     <!--Card content-->

    var cardBody = document.createElement("div");                                //     <div class="card-body">
    cardBody.className = "card-body";
                                                                                    //         <!--Title-->
    var title = document.createElement("h4");                                       //         <h4 class="card-title limit-char-p">Card title</h4>
    title.className = "card-title limit-char-p";
    title.appendChild(document.createTextNode(playlist.attributes.name));
    cardBody.appendChild(title);
    cardBody.appendChild(document.createElement("hr"));                                 //     <hr>
                                                                                            //     <!--Text-->
    var text = document.createElement("p");                                             //     <p class="card-text limit-char-p">PL Description</p>
    text.className = "card-text limit-char-p";
    text.appendChild(document.createTextNode(playlist.attributes.description));

    cardBody.appendChild(text);                                                 //     </div> <!--/.Card content-->
    card.appendChild(cardBody);

                                                                                //     <!-- Card footer -->
    var cardFooter = document.createElement("div");                             //     <div class="card-data">
    cardFooter.className = "card-data";

    var listData = document.createElement("ul");                                  //         <ul>

    var createTime = document.createElement("li");                                      //         <li><i class="fa fa-clock-o"></i> 05/10/2015</li>
    var clockIcon = document.createElement("i");
    clockIcon.className = "fa fa-clock-o";
    createTime.appendChild(clockIcon);
    createTime.appendChild(document.createTextNode(new Date(playlist.attributes.createdTimeMLS).toLocaleDateString()));
    listData.appendChild(createTime);

    var addVideo = document.createElement("li");                                     //     <li><a><i class="fa fa-plus"></i>Thêm video</a></li> //     </ul>
    var addVideoBtn = document.createElement("a");
    addVideoBtn.href = "upload.html?playlistId=" + playlist.id;
    var addVideoIcon = document.createElement("i");
    addVideoIcon.className = "fa fa-upload";                                              //     </div>
  
    addVideoBtn.appendChild(addVideoIcon);
    addVideoBtn.appendChild(document.createTextNode("Upload")); //     <!-- Card footer -->    </div><!--/.Card--> </div> <!/ column>
    addVideo.appendChild(addVideoBtn);



    var deletePl = document.createElement("li");                                     //     <li><a><i class="fa fa-plus"></i>Thêm video</a></li> //     </ul>
    var deletePlBtn = document.createElement("a");
    deletePlBtn.addEventListener("click", function() {
        confirmDeletePl(playlist.id, playlist.attributes.name);
    });
    var deletePlIcon = document.createElement("i");
    deletePlIcon.className = "fa fa-trash";

    deletePlBtn.appendChild(deletePlIcon);
    deletePlBtn.appendChild(document.createTextNode("Xóa"));
    deletePl.appendChild(deletePlBtn);

    listData.appendChild(addVideo);
    listData.appendChild(deletePl);
    cardFooter.appendChild(listData);
    card.appendChild(cardFooter);
    column.appendChild(card);
    document.querySelector("#playlist-tab div.row.display-flex").appendChild(column);

}

function loadVideoByPlaylistId(plId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4){
            if (this.status === 200) {
                var response = JSON.parse(this.responseText).data;
                if (response !== undefined) {
                    document.querySelector("#video-inPl-tab div.row.display-flex").innerHTML = "";
                    for (var i=0; i<response.length; i++) {
                        var videoInPl = new videoData("", response[i].attributes.name, "", "", "", response[i].attributes.thumbnail);
                        videoInPl.display(response[i].id);
                    }
                }
                else {
                    document.querySelector("#video-inPl-tab div.row.display-flex").innerHTML = "";
                }
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("GET", videoApi + '?playlist=' + plId + '&page=1&limit=100', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}

// Display the loaded Video function
videoData.prototype.display = function (videoId) {
    var videoCard = document.createElement("div");
    videoCard.className = "col-lg-3 col-md-4 col-sm-6";
    videoCard.style.overflow = "hidden";
    videoCard.style.textOverflow = "ellipsis";
    // card
    var card = document.createElement("div");
    card.className = "card padding-thumb";
    // view
    var view = document.createElement("div");
    view.className = "view overlay waves-effect waves-light";
    // thumb
    var thumb = document.createElement("img");
    thumb.className = "img-fluid";
    thumb.src = this.data.attributes.thumbnail;
    thumb.style.width = "100%";
    thumb.alt = this.data.attributes.name;

    // mask
    var mask = document.createElement("div");
    mask.className = "mask flex-center";
    // play icon
    var watchBtn = document.createElement("a");
    watchBtn.className = "btn btn-sm info-color";
    watchBtn.appendChild(document.createTextNode("Xem"));
    var deleteBtn = document.createElement("a");
    deleteBtn.className = "btn btn-sm danger-color";
    deleteBtn.appendChild(document.createTextNode("Xóa"));
    // append the thumbnail
    mask.appendChild(watchBtn);
    mask.appendChild(deleteBtn);
    view.appendChild(thumb);
    view.appendChild(mask);
    card.appendChild(view);
    // title link
    var titleLink = document.createElement("a");
    titleLink.className = "grey-text";

    //title
    var title = document.createElement("h6");
    title.appendChild(document.createTextNode(this.data.attributes.name));
    // append the title
    titleLink.appendChild(title);
    // complete the card
    videoCard.appendChild(card);
    videoCard.appendChild(titleLink);
    // append to screen
    document.querySelector("#video-inPl-tab div.row.display-flex").appendChild(videoCard);
};

function showVideoInPlTab(name, plId) {
    document.querySelector("#localTab").querySelectorAll("li")[2].style.display = "";
    document.querySelector("#video-inPl-tab > ul > li > a > span").innerHTML = name;
    document.querySelector("#video-inPl-tab > ul").querySelectorAll("li a")[1].href = "upload.html?playlistId=" + plId;
    $(function () {
        $('#localTab a:last').tab('show')
    })
}

function addPlaylist() {
    var name = document.forms["add-playlist-form"]["name"];
    var description = document.forms["add-playlist-form"]["description"];
    var thumbnail = document.forms["add-playlist-form"]["thumbnail"];
    if (name.validity.valueMissing) {
         toastr["warning"]("Tên playlist không được để trống");
    }
    else if (name.validity.tooShort) {
        toastr["warning"]("Tên playlist có ít nhất 7 ký tự");
    }
    else {
        var newPlaylist = new playlistData(name.value, description.value, thumbnail.value);
        newPlaylist.sendPlaylist();
        if (newPlaylist.xhttp.status === 201) {
            var response = JSON.parse(newPlaylist.xhttp.responseText).data;
            bindPlaylist(response);
            toastr["success"]("Thêm playlist thành công");
            $(function () {
                $('#localTab a:first').tab('show');
            });
            document.forms["add-playlist-form"]["name"].value = "";
            document.forms["add-playlist-form"]["description"].value = "";
            document.forms["add-playlist-form"]["thumbnail"].value = "";
        }
    }
}
function deletePlaylist(plId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                toastr["error"]("Xóa playlist thành công");
                $("#delete-playlist-modal").modal("hide");
                document.querySelector("#playlist-tab div.row.display-flex").removeChild(document.getElementById(plId));
                var response = JSON.parse(this.responseText);
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("DELETE", playlistApi + "/" + plId);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}

function confirmDeletePl(plId, plName) {
    $("#delete-playlist-modal").modal("show");
    document.querySelector("#delete-playlist-modal > div > div > div.modal-header > h5").innerHTML = "Bạn thực sự muốn xóa playlist " + plName + "?";
    document.querySelector("#delete-playlist-modal > div > div > div.modal-body button.btn.danger-color").removeAttribute("onclick");
    document.querySelector("#delete-playlist-modal > div > div > div.modal-body button.btn.danger-color").setAttribute("onclick", 'deletePlaylist(\"' + plId + '\")');
}

function signInFromAlert() {
    $("#alert-modal").modal("hide");
    $("#modalLoginForm").modal("show");
}