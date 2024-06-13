const profiles_el = document.getElementById("profiles");

document.getElementById("add_new_profile").addEventListener("click", function () {
    var profileName = document.getElementById("profile_name").value;
    let profiles = JSON.parse(localStorage.getItem("profiles"));
    if (profiles === null) {
        profiles = [];
    }
    profiles.push(profileName);
    localStorage.setItem("profiles", JSON.stringify(profiles));
    getAllProfiles();
});

function getAllProfiles() {
    let profiles = JSON.parse(localStorage.getItem("profiles"));
    if (profiles === null || profiles.length === 0) {
        profiles = [];
        localStorage.setItem("profiles", JSON.stringify(profiles));
        profiles_el.innerHTML = "No profiles found, create a new one first!";
        return;
    }
    profiles_el.innerHTML = "";
    for (let i = 0; i < profiles.length; i++) {
        let profile = profiles[i];
        let profile_el = document.createElement("li");
        profile_el.innerHTML = profile;
        profile_el.addEventListener("click", function () {
            selectProfile(profile);
        });
        profiles_el.appendChild(profile_el);
    }
}

getAllProfiles();

function selectProfile(profile) {
    localStorage.setItem("selected_profile", profile);
    window.location.href = "zeeslag.html"; // Redirect to the game list
}
