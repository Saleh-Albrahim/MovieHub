const url = window.location.origin;



document.getElementById('login').href = `https://moviehub.eu.auth0.com/authorize?response_type=token&audience=moviehub&client_id=DMqcGxMMzfF2MKkrlt2F360RSi2D1PK9&redirect_uri=
${url}`;
document.getElementById('logout').href = `https://moviehub.eu.auth0.com/v2/logout?returnTo=${url}&client_id=DMqcGxMMzfF2MKkrlt2F360RSi2D1PK9`;
let cookie;
if (location.hash) {
    let jwtValue = location.hash.substr(1).split('&')[0].substring(13);
    createCookie("jwt", 'Bearer ' + jwtValue, 30);
}
const jwt = getCookie("jwt");
if (jwt) {
    // Hide the login button
    $('#login').css('display', 'none');
    // Show the logout button
    $('#logout').attr('style', ' ');
    // Show the private hub button
    $('#private-nav').attr('style', ' ');
}

function createCookie(name, value, expires) {
    cookie = name + "=" + value + ";";

    if (expires) {
        // If it's a date
        if (expires instanceof Date) {
            // If it isn't a valid date
            if (isNaN(expires.getTime()))
                expires = new Date();
        }
        else
            expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

        cookie += "expires=" + expires.toGMTString() + ";";
    }

    cookie += "Path=/; expires=" + expires.toGMTString() + "; ";
    document.cookie = cookie;
}
async function deleteCookie(name) {
    // If the cookie exists delete it 
    if (getCookie(name))
        createCookie(name, "", -1,);
}
function getCookie(name) {
    const regexp = new RegExp("(?:^" + name + "|;\s*" + name + ")=(.*?)(?:;|$)", "g");
    const result = regexp.exec(document.cookie);
    return (result === null) ? null : result[1];
}
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function deletePublic(id) {
    if (!jwt) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Sorry you need to register before adding to your private hub',
            confirmButtonColor: '#f1b722',
            background: '#0c2738',
        });
        return;
    }

    fetch('/public', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                window.location.reload(true);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.msg,
                    confirmButtonColor: '#f1b722',
                    background: '#0c2738',
                });
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.message,
                confirmButtonColor: '#f1b722',
                background: '#0c2738',
            });
        });
}

function deletePrivate(id) {
    if (!jwt) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Sorry you need to register before adding to your private hub',
            confirmButtonColor: '#f1b722',
            background: '#0c2738',
        });
        return;
    }

    fetch('/private', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                window.location.reload(true);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.msg,
                    confirmButtonColor: '#f1b722',
                    background: '#0c2738',
                });
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.message,
                confirmButtonColor: '#f1b722',
                background: '#0c2738',
            });
        });
}

//  Delete the cookie on logout
$('#logout').on('click', async (e) => {

    deleteCookie('jwt');
});


