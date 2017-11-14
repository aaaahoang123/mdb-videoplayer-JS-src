$(document).ready(function () {
    $(".hover-popover").popover({
        trigger: "hover"
    });
    // Tooltips Initialization
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
});

// method for videoData object
videoData.prototype.addIdCrTime = function (id, createTime) {
	this.id = id;
	this.createdTime = createTime;
};

videoData.prototype.watchVideo = function () {
	document.querySelector("#watching-video > div.card > div > iframe").src = "https://www.youtube.com/embed/" + this.data.attributes.youtubeId + "?autoplay=1";
    document.querySelector("#watching-video > div.card > div.card-body > div.row > h4.col-md-9").innerHTML = this.data.attributes.name;
    var createdTime = new Date(this.createdTime).toLocaleDateString();
    document.querySelector("#watching-video > div.card > div.card-body").querySelectorAll("p span")[0].innerHTML = createdTime;
    document.querySelector("#watching-video > div.card > div.card-body").querySelectorAll("p span")[1].innerHTML = this.data.attributes.description;
    var keywords = JSON.stringify(this.data.attributes.keywords);
    if (keywords !== undefined) {
        keywords = keywords.replace("[", "");
        keywords = keywords.replace("]", "");
	}
	document.getElementById("video-keyword").innerHTML = keywords;
};

videoData.prototype.bindToSide = function () {
// <div class="row padding-thumb">
//         <div class="col-md-6">
//         		<a><img src="https://i.ytimg.com/vi/H4df9yW98TU/mqdefault.jpg" alt="" style="width: 100%"></a>
//         </div>
//         <div class="col-md-6">
//         		<div class="ellipsis">
//         			<a class="" style="margin-bottom: 5px">웬만해선 건드리면 안되는 노래" 스틸하트 - She's Gone 부른 가수들 모음</a>
//     			</div>
//     			<p class="grey-text watch-side-title"><strong>Xuất bản:</strong> <span>13/12/1988</span></p>
//     		</div>
//     </div>
	// row of thumbnail
	var videoDataToDrag = new videoData();
	videoDataToDrag.data = this.data;
	var row = document.createElement("div");
	row.className = "row padding-thumb animated fadeIn";
	// column Image
	var columnImage =  document.createElement("div");
    columnImage.className = "col-md-6";
    // anchor image
	var anchorImage = document.createElement("a");
	anchorImage.href = "watch.html?yid=" + this.data.attributes.youtubeId;
	anchorImage.setAttribute("draggable", "true");
    anchorImage.addEventListener("dragstart", function (event) {
		dragVideo(event, videoDataToDrag);
    });

	// image
	var image = document.createElement("img");
	image.src = this.data.attributes.thumbnail;
	image.alt = this.data.attributes.name;
    image.title = this.data.attributes.name;
    image.style.width = "100%";

    // append the left column
    anchorImage.appendChild(image);
    columnImage.appendChild(anchorImage);
    row.appendChild(columnImage);

    // column detail
	var columnDetail = document.createElement("div");
    columnDetail.className = "col-md-6";

    // title
	var title = document.createElement("div");
	title.className = "ellipsis";

	// anchor title
	var anchorTitle  = document.createElement("a");
	anchorTitle.style.marginBottom = "5px";
	anchorTitle.className = "hover-popover black-text";
	anchorTitle.href = "watch.html?yid=" + this.data.attributes.youtubeId;
	anchorTitle.setAttribute("data-toggle", "popover");
    anchorTitle.setAttribute("data-placement", "top");
    anchorTitle.setAttribute("data-content", this.data.attributes.name);
    anchorTitle.setAttribute("data-original-title", "");
    anchorTitle.setAttribute("title", "");
	anchorTitle.appendChild(document.createTextNode(this.data.attributes.name));
	title.appendChild(anchorTitle);

	// created time
	var createdTimeTag = document.createElement("p");
    createdTimeTag.className = "grey-text watch-side-title";
	var createdTime = new Date(this.createdTime).toLocaleDateString();
    createdTimeTag.innerHTML = "<strong>Xuất bản:</strong> <span>" + createdTime + "</span>";

    // append the right column
    columnDetail.appendChild(title);
    columnDetail.appendChild(createdTimeTag);
    row.appendChild(columnDetail);
    document.getElementById("sub-video").appendChild(row);
};

videoData.prototype.bindToTab = function (element, playlistId) {
    // <div class="col-md-4" style="overflow: hidden; text-overflow: ellipsis;">
		// 	<div class="card">
			// 	<div class="view overlay waves-effect waves-light">
				// 	<img class="img-fluid" src="https://i.ytimg.com/vi/iKzRIweSBLA/mqdefault.jpg" alt="Ed Sheeran - Perfect [Official Lyric Video]" style="width: 100%;">
				// 	<a>
				// 		<div class="mask flex-center">
				// 			<i class="fa fa-play-circle fa-3x green-text"></i>
				// 		</div>
				// 	</a>
			// 	</div>
		// 	</div>
		// 	<a class="grey-text">
		// 		<h6>Ed Sheeran - Perfect [Official Lyric Video]</h6>
		// </a>
    // </div>

	// column
	var column = document.createElement("div");
	column.className = "col-lg-2 col-md-4 col-sm-6";
	column.style.overflow = "hidden";
	column.style.textOverflow = "ellipsis";

	// card
	var card = document.createElement("div");
	card.className = "card";

	// view
	var view = document.createElement("div");
	view.className = "view overlay waves-effect waves-light";

	// image
	var image = document.createElement("img");
	image.className = "img-fluid";
    image.src = this.data.attributes.thumbnail;
    image.alt = this.data.attributes.name;
    image.title = this.data.attributes.name;
    image.style.width = "100%";

    // anchor mask
	var anchorMask = document.createElement("a");
	anchorMask.href = "watch.html?plid=" + playlistId + "&cid=" + this.id;
	// mask
	var mask = document.createElement("div");
	mask.className = "mask flex-center";
	mask.innerHTML = '<i class="fa fa-play-circle-o fa-3x white-text"></i>';

	// append card to column
	anchorMask.appendChild(mask);
	view.appendChild(image);
    view.appendChild(anchorMask);
    card.appendChild(view);
    column.appendChild(card);

    // anchor title
	var anchorTitle = document.createElement("a");
	anchorTitle.href = "watch.html?plid=" + playlistId + "&cid=" + this.id;

	anchorTitle.className = "grey-text";

	// title
	var title = document.createElement("h6");
    title.style.marginTop = "5px";
	title.appendChild(document.createTextNode(this.data.attributes.name));
	anchorTitle.appendChild(title);
    column.appendChild(anchorTitle);

    // append the column to element
    element.appendChild(column);
};
// bind to form
videoData.prototype.bindToForm = function () {
	document.forms["uploadOrEditForm"]["videoId"].value = this.data.attributes.youtubeId;
    document.forms["uploadOrEditForm"]["videoName"].value = this.data.attributes.name;
    document.forms["uploadOrEditForm"]["description"].value = this.data.attributes.description;
    document.forms["uploadOrEditForm"]["keywords"].value = this.data.attributes.keywords;
    document.forms["uploadOrEditForm"]["playlistId"].value = this.data.attributes.playlistId;
    var labels = document.querySelectorAll("#uploadOrEditForm label");
    for (var i=0; i<labels.length; i++) {
    	labels[i].className = "active";
	}
};
function loadSuggestVideo(keyword) {
	var url = 'https://content.googleapis.com/youtube/v3/search?q=' + keyword + '&videoEmbeddable=true&maxResults=10&type=video&videoSyndicated=true&part=snippet&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				var response = JSON.parse(this.responseText).items;
				for (var i=0; i<response.length; i++) {
					var video = new videoData(response[i].id.videoId, response[i].snippet.title, response[i].snippet.description, "", "", response[i].snippet.thumbnails.medium.url);
					video.addIdCrTime("", response[i].snippet.publishedAt);
					video.bindToSide();
				}
                $(".hover-popover").popover({
                    trigger: "hover"
                });
			}
			else {
                respone = JSON.parse(this.responseText);
                console.log(respone);
                toastr["warning"]("Đã xảy ra lỗi! Có thể không tìm thấy video nào liên quan!");
			}
		}
    };
	xhttp.open("GET", url, true);
	xhttp.send();
}
// load video of youtube
function loadVideoOfYoutube(id, callBack) {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ id + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText).items[0];
                callBack.success(response);
            }
            else {
                response = JSON.parse(this.responseText);
                toastr["error"]("Xảy ra lỗi khi load video, vui lòng kiểm inspect log và báo cho chúng tôi");
                console.log(response);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
// load video of playlist
function loadVideoOfPlaylist(plId, id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4){
            if (this.status === 200) {
                var response = JSON.parse(this.responseText).data;
                if (response !== undefined) {
                	var j = 0;
                	for (var i=0; i<response.length; i++) {
                		if (response[i].id === id) {  // filter the choosen video to play! If no choosen video, play the first video
                			j = i;
						}
					}
					var watchingVideo = new videoData(response[j].attributes.youtubeId, response[j].attributes.name, response[j].attributes.description, response[j].attributes.keywords, plId, response[j].attributes.thumbnail);
                	console.log(watchingVideo);
                	watchingVideo.bindToForm();
                    document.querySelector("#videoFormModal > div > div > div.modal-footer > button").addEventListener("click", function () {
						editVideo(watchingVideo.id);
                    });
                    // auto complete Button
                    var autoCompleteBtn = document.createElement("button");
                    autoCompleteBtn.type = "button";
                    autoCompleteBtn.className = "btn btn-primary waves-effect waves-light";
                    autoCompleteBtn.title = "Hoàn thành form với thông tin mặc định của video";
                    autoCompleteBtn.appendChild(document.createTextNode("Mặc định"));
                    var autoCompleteIcon = document.createElement("i");
                    autoCompleteIcon.className = "fa fa-star-o ml-1";
                    autoCompleteBtn.appendChild(autoCompleteIcon);
                    autoCompleteBtn.addEventListener("click", function () {
                        loadVideoOfYoutube(watchingVideo.data.attributes.youtubeId, {
                            success: function (resp) {
                                if (resp !== undefined) {
                                    var video = new videoData(resp.id, resp.snippet.title, resp.snippet.description, resp.snippet.tags,  "", resp.snippet.thumbnails.medium.url);
                                    video.bindToForm();
                                }
                                else {
                                    console.log(resp);
                                    toastr["warning"]("Xảy ra lỗi bất thường khi load video");
                                }
                            }
                        })
                    });
                    document.querySelector("#videoFormModal > div > div > div.modal-footer").appendChild(autoCompleteBtn);

                    // delete button
                    document.querySelector("#alert-delete-video > div > div > div.modal-footer").querySelectorAll("a")[0].addEventListener("click", function () {
						deleteVideo(watchingVideo.id);
                    });
                    watchingVideo.addIdCrTime(response[j].id, response[j].attributes.createdTimeMLS);
                    loadSuggestVideo(watchingVideo.data.attributes.name);
                    watchingVideo.watchVideo();
                    response.splice(j, 1);
                    for (i=0; i<response.length/6; i++) {
                        var pagiNation = document.createElement("li");
                        pagiNation.className = "nav-item";
                        var pagiNationAnchor = document.createElement("a");
                        pagiNationAnchor.setAttribute("data-toggle", "tab");
                        pagiNationAnchor.setAttribute("role", "tab");
                        var tabPane = document.createElement("div");
                        if (i === 0) {
                            tabPane.className = "tab-pane fade in show active";
                            tabPane.id = "same-pl-tab-1";
                            pagiNationAnchor.className = "nav-link orange-text waves-light active";
                        }
                        else {
                            tabPane.className = "tab-pane fade";
                            tabPane.id = "same-pl-tab-" + (i+1);
                            pagiNationAnchor.className = "nav-link orange-text waves-light";
                        }
                        var row = document.createElement("div");
                        row.className = "row";
                        pagiNationAnchor.href = "#" + tabPane.id;
                        pagiNationAnchor.innerHTML = i+1;
                        pagiNation.appendChild(pagiNationAnchor);
                        for (j=i*6; j < i*6 + 6 && j < response.length; j++) {
                            var video = new videoData(response[j].attributes.youtubeId, response[j].attributes.name, "", "", response[j].attributes.playlistId, response[j].attributes.thumbnail);
                            video.addIdCrTime(response[j].id, "");
                            video.bindToTab(row, response[j].attributes.playlistId);
                            tabPane.appendChild(row);
                        }
                        document.querySelector("#same-playlist-modal > div > div > div.modal-body > div.tab-content").appendChild(tabPane);
                        document.querySelector("#same-playlist-modal > div > div > div.modal-body > section.tabs-wrapper > ul").appendChild(pagiNation);
                    }
				}
                document.getElementById("content").style.display = "";
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

// Load playlist detail
function loadPlaylistDetail(plId) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				var response = JSON.parse(this.responseText).data;
				if (response !== undefined) {
                    for (var i=0; i<response.length; i++) {
                        var option = document.createElement("option");
                        option.value = response[i].id;
                        option.innerHTML = response[i].attributes.name;

                        if (response[i].id === plId) {
                            option.setAttribute("selected", "true");
                            document.querySelector("#watching-playlist > div.view > div.playlist-thumb").style.backgroundImage = "url(" + response[i].attributes.thumbnailUrl + ")";
                            document.querySelector("#watching-playlist").addEventListener("dragover", function (event) {
                                allowDrop(event);
                            });
                            document.querySelector("#watching-playlist").addEventListener("drop", function (event) {
                                drop(event, plId);
                            });
                            document.querySelector("#watching-playlist > div.card-body > h4").innerHTML = response[i].attributes.name;
                            document.querySelector("#watching-playlist > div.card-body > p").innerHTML = response[i].attributes.description;
                            document.querySelector("#watching-playlist > div.card-data > ul > li > span").innerHTML = new Date(response[i].attributes.createdTimeMLS).toLocaleDateString();
                        }
                        document.forms["uploadOrEditForm"]["playlistId"].appendChild(option);
                    }
                }
                $('.material').materialForm();
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

// upload video method
videoData.prototype.uploadVideo = function () {
    this.pUploadVideo({
       success: function (response) {
           toastr["success"]("Đã thêm video thành công!");
           $("#videoFormModal").modal("hide");
           console.log(response);
       },
       error: function (response) {
           toastr["warning"]("Upload video thất bại. Vui lòng inspect logs hoặc báo cho chúng tôi! Xin lỗi vì sự bất tiện này!");
           console.log(response);
       }
    });
};
function uploadVideo() {
    var id = document.forms["uploadOrEditForm"]["videoId"].value;
    var name = document.forms["uploadOrEditForm"]["videoName"].value;
	var description = document.forms["uploadOrEditForm"]["description"].value;
    var keywords = document.forms["uploadOrEditForm"]["keywords"].value;
    var playlistId = document.forms["uploadOrEditForm"]["playlistId"].value;
    var thumbnail = "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
    var dataToSend = new videoData(id, name, description, keywords, playlistId, thumbnail);
    dataToSend.uploadVideo();
}

// edit video method
videoData.prototype.editVideo = function (videoId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                var response = JSON.parse(this.responseText);
                toastr["success"]("Chỉnh sửa video thành công! Mời xem lại tại mục quản lý playlist");
                $("#videoFormModal").modal("hide");
                console.log(response);
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("PUT", videoApi + "/" + videoId, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send(JSON.stringify(this));
};

function editVideo(videoId) {
    var id = document.forms["uploadOrEditForm"]["videoId"].value;
    var name = document.forms["uploadOrEditForm"]["videoName"].value;
    var description = document.forms["uploadOrEditForm"]["description"].value;
    var keywords = document.forms["uploadOrEditForm"]["keywords"].value;
    var playlistId = document.forms["uploadOrEditForm"]["playlistId"].value;
    var thumbnail = "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
    var dataToSend = new videoData(id, name, description, keywords, playlistId, thumbnail);
    dataToSend.editVideo(videoId);
}

// Delete video function
function deleteVideo(videoId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                toastr["error"]("Xóa video thành công");
                $("#videoFormModal").modal("hide");
                $("#alert-delete-video").modal("hide");
                setTimeout(function () {
					location.href = "../index.html";
                }, 1000);
                console.log(response);
            }
            else {
                response = JSON.parse(this.responseText);
                console.log(response);
            }
        }
    };
    xhttp.open("DELETE", videoApi + "/" + videoId, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
    xhttp.send();
}

// drag and drop
//drag and drop
function dragVideo(event, videoObj) {
    event.dataTransfer.setData("text/plain",JSON.stringify(videoObj));
}
function allowDrop(event) {
    if(event.preventDefault) { event.preventDefault(); }
    if(event.stopPropagation) { event.stopPropagation(); }
}
function drop(event, playlistId) {
    if(event.preventDefault) { event.preventDefault(); }
    if(event.stopPropagation) { event.stopPropagation(); }
    var data = JSON.parse(event.dataTransfer.getData("text"));
    data.data.attributes.playlistId = playlistId;
    var dataToSend = new videoData();
    dataToSend.data = data.data;
    dataToSend.uploadVideo();

}

// Load the page by location.search object

if (location.search === "") {
    $("#alertModal").modal();
}
else {
    var searchObj = convertLocationSearchToJSON(location.search);
    if (searchObj === undefined || (searchObj.plid === undefined && searchObj.yid === undefined)) {
        $("#alertModal").modal();
    }
    else if (searchObj.yid !== undefined) {
        loadVideoOfYoutube(searchObj.yid, {
            success: function (response) {
                if (response !== undefined) {
                    var video = new videoData(response.id, response.snippet.title, response.snippet.description, response.snippet.tags,  "", response.snippet.thumbnails.medium.url);
                    video.bindToForm();
                    document.querySelector("#videoFormModal > div > div > div.modal-footer > button").addEventListener("click", uploadVideo);
                    video.addIdCrTime("", response.snippet.publishedAt);
                    video.watchVideo();
                    loadSuggestVideo(response.snippet.title);
                    document.getElementById("content").style.display = "";
                }
                else {
                    $("#alertModal").modal();
                }
            }
        });
        if (userToken !== null) {
            document.querySelector("#y-video-activator").style.display = "";
            loadPlaylistDetail("");
		}
        else {

        }
	}
	else if (searchObj.plid !== undefined) {
    	if (userToken !== null) {
            loadPlaylistDetail(searchObj.plid);
            document.querySelector("#watching-playlist").style.display = "";
            document.querySelector("#c-video-activator").style.display = "";
            if (searchObj.cid !== undefined) {
                loadVideoOfPlaylist(searchObj.plid, searchObj.cid);
            }
            else {
                loadVideoOfPlaylist(searchObj.plid, "");
            }
		}
		else {
            $("#alertModal").modal();
		}
	}
}
