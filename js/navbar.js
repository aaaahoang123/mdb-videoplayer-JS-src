var videoApi = 'https://youtube-api-challenger2.appspot.com/videos';
var membersApi = 'https://youtube-api-challenger2.appspot.com/members';
var authenticationApi = 'https://youtube-api-challenger2.appspot.com/authentication';
var playlistApi = 'https://youtube-api-challenger2.appspot.com/playlists';
var userToken = localStorage.getItem('token');
if (userToken !== null) {
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[0].innerHTML = '<i class="fa fa-user"></i>' + localStorage.getItem('username');
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[1].innerHTML = '<i class="fa fa-sign-out"></i> Đăng xuất';
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[1].addEventListener('click', signOut);
}
else {
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[0].innerHTML = '<i class="fa fa-user"></i> Đăng ký';
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[1].innerHTML = '<i class="fa fa-sign-in"></i> Đăng nhập';
    document.querySelector("ul.navbar-nav.ml-auto").querySelectorAll("li a")[1].addEventListener('click', openSigninModal);
}
function openSigninModal() {
    $("#modalLoginForm").modal('show');
    return true;
}
function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setTimeout (function () {
        location.reload();
    },400);
}
var signIn = function () {
    var username = document.forms["signinForm"]["username"].value;
    var password = document.forms["signinForm"]["password"].value;
    var signinData = {
        "data": {
            "type": "MemberLogin",
            "attributes": {
                "username": username,
                "password": password
            }
        }
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            var response = JSON.parse(this.responseText);
            localStorage.setItem('username', signinData.data.attributes.username);
            localStorage.setItem('token', response.data.attributes.secretToken);
            document.querySelector("#modalLoginForm").classList.remove('fadeIn');
            document.querySelector("#modalLoginForm").classList.add('fadeOut');
            setTimeout(function () {
                $("#modalLoginForm").modal('hide');
                toastr["success"]("Đăng nhập thành công!");
            },500);
            setTimeout (function () {
                location.reload();
            },1200);
        }
        else if (this.readyState === 4 && this.status !== 200){
            var errorResponse = JSON.parse(this.responseText);
            console.log(errorResponse);
        }
    };
    xhttp.open("POST", authenticationApi, true);
    xhttp.send(JSON.stringify(signinData));
};