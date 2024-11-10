
var slideIndex = 0;
carousel();

function carousel() {
    var items = [];
    var bioContainer = document.getElementsByClassName("bio")[0];
    bioContainer.style = "display: grid !important;";
    document.getElementsByClassName("js-reminder")[0].style = "display: none !important;";
    var rawListItems = bioContainer.getElementsByTagName("div");
    for (var i = 1; i < rawListItems.length; i++) {
        rawListItems[i].style = "display: none;";
    }
    slideIndex++;
    if (slideIndex > rawListItems.length || slideIndex == 1) {
        slideIndex = 2
    }
    rawListItems[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 1000);
}
window.onload = function () {
    let script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js";
    document.body.appendChild(script);

    const sortOnKey = (key, desc) => {
        return (a, b) => {
            a = a[key];
            b = b[key];
            return desc ? b - a : a - b;
        };
    };

    String.prototype.replaceAt = function (index, replacement) {
        return (
            this.substr(0, index) +
            replacement +
            this.substr(index + replacement.length)
        );
    };
    
    fetch("https://api.github.com/users/fraujulian/repos?per_page=999")
        .then((response) => response.json())
        .then((projects) => {
            projects = projects.sort(sortOnKey("stargazers_count", true));
            let projectsDiv = document.getElementById("github_projects");
            projectsDiv.innerHTML = "";
            projectsDiv.classList = "";
            for (let i = 0; i < 16; i++) {
                let projectDiv = document.createElement("div");
                projectDiv.classList = "card hoverable";
                let project = projects[i];
                if (project != undefined) {
                    if (project.description == null)
                        project.description = "";
                    if (project.language == null)
                        project.language = "";
                    project.name = project.name.replaceAll("_", " ").replaceAll("-", " ");
                    projectDiv.innerHTML = `
                    <div class="media">
                        <div class="media-body">
                            <a href="${project.html_url}" onclick="plausible('${project.name}')" target="_blank">
                                <strong class="d-block text-gray-dark">${project.name}</strong>
                            </a>
                            <div class="stars" style="float:right;">
                                ${project.language}
                                <i class="far fa-star stargazers"></i>${project.stargazers_count}
                            </div>
                        </div>
                        <p>${project.description}</p>
                    </div>
                    `;
                    fetch(
                        `https://raw.githubusercontent.com/${project.full_name}/master/README.md`
                    )
                        .then((response) => response.text())
                        .then((text) => {
                            let converter = new showdown.Converter();
                            let html = converter.makeHtml(text);
                            let projectModal = document.createElement("div");
                            projectModal.classList = "modal github-modal hidden";
                            projectModal.innerHTML = `
                        <div class="card">
                            <a onclick="location.reload()" href="#" style="float: right"> ❌</a>
                            <a href="${project.html_url}" target="blank" style="float: left"> Visit on GitHub</a>
                            <br>
                            <br>
                            ${html}
                        </div>
                    `;

                            projectDiv.onclick = function () {
                                projectModal.classList.remove("hidden");
                                document.body.scrollTop = 0; // Safari
                                document.documentElement.scrollTop = 0; // Chrome Firefox IE Opera
                                document.body.style.opacity = 0.2;
                            };

                            projectModal.onclick = function (evt) {
                                if (evt.target == projectModal) {
                                    projectModal.classList.add("hidden");
                                    document.body.style.opacity = 1;
                                }
                            };
                            document
                                .getElementsByTagName("html")[0]
                                .appendChild(projectModal);
                        });
                    projectsDiv.appendChild(projectDiv);
                }
            }
        });
};

let bioBtn = document.getElementById('short-desc');
let bioModel = document.getElementsByClassName('bio-text')[0];
let leftArrow = document.getElementById("left-arrow");
let rightArrow = document.getElementById("right-arrow");
let hidden = true;

bioBtn.onclick = function () {
    if (hidden) {
        bioModel.classList.remove("hidden");
        leftArrow.classList.remove("fa-arrow-right");
        leftArrow.classList.add("fa-arrow-down");
        rightArrow.classList.remove("fa-arrow-left");
        rightArrow.classList.add("fa-arrow-down");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        unfade(bioModel);
    } else {
        bioModel.classList.add("hidden");
        leftArrow.classList.remove("fa-arrow-down");
        leftArrow.classList.add("fa-arrow-right");
        rightArrow.classList.remove("fa-arrow-down");
        rightArrow.classList.add("fa-arrow-left");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        fade(bioModel);
    }
    hidden = !hidden;
};

bioModel.onclick = function (evt) {
    if (evt.target == bioModel) {
        bioModel.classList.add("hidden");
        document.body.style.opacity = 1;
    }
};

function fade(element) {
    var op = 1; 
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 5);
}

function unfade(element) {
    var op = 0.1; 
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 5);
}
