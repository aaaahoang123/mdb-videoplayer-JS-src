if (userToken !== null) {
    location.href = "../index.html";
}
var signupData = function (username, password, email, fullName, gender, birthDay, avatar) {
    this.data = {
        "type": "Member",
        "attributes": {
            "username": username,
            "password": password,
            "email": email,
            "fullName": fullName,
            "gender": gender,
            "birthDay": birthDay,
            "avatar": avatar

        }
    }
};

signupData.prototype.signUp = function () {
  var dataToSend = this;
  this.xhttp = new XMLHttpRequest();
  this.xhttp.open("POST", membersApi, false);
  this.xhttp.send(JSON.stringify(dataToSend));
};

function signUp() {
    var username = document.forms["signup-form"]["username"];
    var password = document.forms["signup-form"]["password"];
    var confirmPassword = document.forms["signup-form"]["confirm-password"];
    var email = document.forms["signup-form"]["email"];
    var fullName = document.forms["signup-form"]["full-name"];
    var birthday = document.forms["signup-form"]["birthday"];
    var gender = document.forms["signup-form"]["gender"];
    var avatar = document.forms["signup-form"]["avatar"];
    confirmPassword.setAttribute("pattern", password.value);
    // Validate username
    if (username.validity.valueMissing) {
        toastr["warning"]("Tài khoản không được để trống");
    }
    else if (username.validity.tooShort) {
        toastr["warning"]("Tên tài khoản quá ngắn");
    }
    else if (username.validity.patternMismatch) {
        toastr["warning"]("Tài khoản không được có ký tự đặc biệt");
    }
    // validate email
    else if (email.validity.valueMissing) {
        toastr["warning"]("Email không được để trống");
    }
    else if (email.validity.typeMismatch) {
        toastr["warning"]("Email chưa đúng định dạng");
    }
    //Validate Password
    else if (password.validity.valueMissing) {
        toastr["warning"]("Mật khẩu không được để trống");
    }
    else if (password.validity.tooShort) {
        toastr["warning"]("Mật khẩu quá ngắn");
    }
    // Validate confirm Password
    else if (confirmPassword.validity.patternMismatch || confirmPassword.validity.valueMissing) {
        toastr["warning"]("Nhập lại mật khẩu chưa chính xác");
    }
    else {
        var dataToSend = new signupData(username.value, password.value, email.value, fullName.value, gender.value, (new Date(birthday.value))*1, avatar.value);
        dataToSend.signUp();
        if (dataToSend.xhttp.status === 201) {
            toastr["success"]("Đăng ký tài khoản thành công");
            var response = JSON.parse(dataToSend.xhttp.responseText);
            var signInData = new signinData(response.data.attributes.username, response.data.attributes.password);
            setTimeout(function () {
                signInData.signIn();
            }, 1000);
        }
        else {
            response = JSON.parse(dataToSend.xhttp.responseText);
            toastr["error"](response.errors[0].title + "! " + response.errors[0].detail);
        }
    }
}
function resetForm() {
   var labels = document.querySelector("#signup-form").querySelectorAll("label");
   for (var i=0; i<labels.length; i++) {
       labels[i].removeAttribute("class");
   }
   labels[5].setAttribute("class", "active");
}