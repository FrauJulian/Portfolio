  window.onload = function () {
      let script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js";
      document.body.appendChild(script);

      const sortOnKey = (key, desc) => {
          return (a, b) => {
              a = a[key];
              b = b[key];
              return desc ? b - a : a - b;
          }
      };

      String.prototype.replaceAt = function (index, replacement) {
          return this.substr(0, index) + replacement + this.substr(index + replacement.length);
      }
      fetch("https://api.github.com/users/fraujulian/repos?per_page=999")
          .then(response => response.json())
          .then(projects => {
              projects = projects.sort(sortOnKey("stargazers_count", true));
              let projectsDiv = document.getElementById("github_projects");
              projectsDiv.innerHTML = "";
              projectsDiv.classList = "";
              for (let i = 0; i < 6; i++) {
                  let projectDiv = document.createElement("div");
                  projectDiv.classList = "card hoverable";
                  let project = projects[i];
                  if (project != undefined) {
                      if (project.description == null)
                          project.description = "This project has no description";
                      if (project.language == null)
                          project.language = "No language stored!";
                      project.name = project.name.replaceAll('_', ' ').replaceAll('-', ' ');
                      projectDiv.innerHTML = `
                    <div class="media">
                        <div class="media-body">
                            <a href="${project.html_url}" onclick="plausible('${project.name}')" target="_blank">
                                <strong class="d-block text-gray-dark">${project.name}</strong>
                            </a>
                            <div class="stars" style="float:right;">
                                    📕 ${project.language} <br>
                                    ⭐ ${project.stargazers_count}
                            </div>
                        </div>
                        <p>${project.description}</p>
                    </div>
                    `;
                      fetch(`https://raw.githubusercontent.com/${project.full_name}/master/README.md`)
                          .then(response => response.text())
                          .then(text => {
                              let converter = new showdown.Converter();
                              let html = converter.makeHtml(text);
                              let projectModal = document.createElement("div");
                              projectModal.classList = "modal github-modal hidden";
                              projectModal.innerHTML = `
                        <div class="card">
                            <a href="${project.html_url}" target="blank" style="float: right">Visit on GitHub</a>
                            <a href="#" target="blank" style="float: left">❌</a>
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
                              document.getElementsByTagName("html")[0].appendChild(projectModal);
                          });
                      projectsDiv.appendChild(projectDiv);
                  }
              }
          });
  };