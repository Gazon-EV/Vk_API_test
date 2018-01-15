'use strict';

(function () {
    var userName = localStorage.getItem('userNameInStorage') || '';
    var userLink = localStorage.getItem('userLinkInStorage') || '';
    var friendsGetParam = {
        order: 'random',
        count: 5,
        offset: 10,
        fields: 'photo_50'
    };

    function stopPreloaderFunc () {
        console.log('stoppreload');
        var stopPreloader;

        stopPreloader = document.getElementById('pre_loader');
        stopPreloader.style.display = 'none';
    }

  	function getCookie (name) {
        console.log('getcoocie');
  		var matches = document.cookie.match(new RegExp(
   		    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
 		));
  		return matches ? decodeURIComponent(matches[1]) : void 0;
    }

    function oAuth() {
        console.log('oauth');
        VK.Auth.login(updateStorageUserData, 2);
    }

    function createFriendBlock (i, aboutFriends) {
        var figure;
        var link;
        var figcaption;
        var imgFriend;

        console.log('createFriendBlock');
        figure = document.createElement('figure');
        figure.id = 'friendPlace'+i;
        figure.className = 'friendBlock';
        document.getElementById('createPlace').appendChild(figure);

        link = document.createElement('a');
        link.id = 'friendLink'+i;
        link.className = 'linkClass';
        link.href = 'https://vk.com/id'+aboutFriends[i-1].user_id;
        figure.appendChild(link);

        imgFriend = document.createElement('img');
        imgFriend.id = 'friendImg'+i;
        imgFriend.className = 'imgClass';
        imgFriend.src = aboutFriends[i-1].photo_50;
        link.appendChild(imgFriend);

        figcaption = document.createElement('figcaption');
        figcaption.innerHTML = aboutFriends[i-1].first_name;
        link.appendChild(figcaption);
    }

    function createFriendList (data) {
        var stopDiv;
        var stopDiv1;

        console.log('createFriendList');
	    document.title = 'Друзья';
        document.getElementById('createPlace').innerHTML ='<a href='+userLink+'>Привет, '+userName+'!</a>';

        stopDiv = document.createElement('div');
        stopDiv1 = document.createElement('div');
        stopDiv.className = "width: 100%; height: 1px; clear: both; float: none;";
        stopDiv1.className = "width: 100%; height: 1px; clear: both; float: none;";

        document.getElementById('createPlace').appendChild(stopDiv);

        for (var i = 1; i < 6; i++) {
            createFriendBlock(i,data);
        }

        document.getElementById('createPlace').appendChild(stopDiv1);
    }

    function updateStorageUserData (data) {
        console.log('updateStorage');
        userName = data.session.user.first_name;
        userLink = data.session.user.href;
        localStorage.setItem('userNameInStorage', userName);
        localStorage.setItem('userLinkInStorage', userLink);
        location.reload(true);
    }

    function initVKApi () {
        console.log('initVk');

        window.vkAsyncInit = function() {
            VK.init({
                apiId: 6115611,
            onlyWidgets: false
            });
        };

        setTimeout(function() {
            var el = document.createElement("script");
            el.type = "text/javascript";
            el.src = "https://vk.com/js/api/openapi.js?146";
            el.async = true;
            document.getElementById("vk_api_transport").appendChild(el);
        }, 0);
    }

    function getFriendListFromVK (callback) {
        console.log('getFriend');
  	    var response;

        VK.Api.call('friends.get', friendsGetParam, function(data) {
            response = data.response || {};

            if (typeof callback === 'function') {
                callback(null,response);
            }
            else {
                callback(new Error('Callback have to be a function'))
            }
        });
    }

    function createButton () {
        console.log('createButton');
        var p;
        var button;

        button = document.createElement('button');
        button.id = 'toClick';
        button.className = 'pulse';
        button.addEventListener('click',oAuth);
        document.getElementById('createPlace').appendChild(button);

        p = document.createElement('p');
        p.textContent = 'Жмяк';
        document.getElementById('createPlace').appendChild(p);
    }

    function init () {
        console.log('init');
        stopPreloaderFunc();

        if (getCookie('vk_app_6115611') === void 0) {
            initVKApi();
            createButton();
        }
        else {
            initVKApi();

            getFriendListFromVK(function (err, data) {
                if (err) {
                    return console.error(err.stack);
                }
                else {
                    createFriendList(data);
                }
            });
        }

    }

    window.onload = init;

})();
