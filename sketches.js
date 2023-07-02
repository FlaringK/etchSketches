// Load Json
fetch("sketches.json").then(response => response.json()).then(json => loadPage(json));

const getUrlParam = (key) => {
  const urlParams = new URLSearchParams(window.location.search);
  const p = urlParams.get(key)
  return p ? p : "home"
}

const keyfy = text => text.toLowerCase().replace(/[^a-z0-9]/g, "")

let urlPre = ""
urlPre = window.location.href.includes("/etchSketches") ? "/etchSketches" : ""

// Init links
const linkContentsTable = (sketches) => {

  const toc = document.getElementById("toc")

  sketches.forEach((section, i) => {
    
    // Make header
    toc.innerHTML += `<h3>${section.section}</h3>`

    // Make list
    let ul = document.createElement("ul")
    section.stories.forEach(story => {
      let li = document.createElement("li")
      let a = document.createElement("a")

      a.innerText = story.title
      a.href = urlPre + `/?section=${keyfy(section.section)}&sketch=${keyfy(story.title)}`

      li.appendChild(a)
      ul.appendChild(li)
    })
    toc.appendChild(ul)

  });

  // Hide nav links
  document.getElementById("navLinks").style.display = "none"
}

const loadPage = sketches => {
  console.log(sketches)
  const sectionKey = getUrlParam("section");
  const sketchKey = getUrlParam("sketch");

  if (sectionKey == "home") { 
    linkContentsTable(sketches) 
    return
  }

  // Remove home
  document.getElementById("home").style.display = "none"

  // Load data
  const sectionIndex = sketches.map(e => keyfy(e.section)).indexOf(sectionKey)
  const section = sketches[sectionIndex].stories

  const sketchIndex = section.map(e => keyfy(e.title)).indexOf(sketchKey)
  const sketchData = section[sketchIndex]

  document.getElementById("sketchTitle").innerHTML = sketchData.title
  document.getElementById("sketch").className = sketchData.theme
  // document.getElementById("img").src = sketchData.img
  document.getElementById("body").innerHTML = sketchData.body

  // Set nav links
  prevLink = document.querySelector("#prevLink a")
  nextLink = document.querySelector("#nextLink a")

  if (section[sketchIndex - 1]) {
    prevLink.href = urlPre + `/?section=${keyfy(sketches[sectionIndex].section)}&sketch=${keyfy(section[sketchIndex - 1].title)}`
    prevLink.innerText = "< " + section[sketchIndex - 1].title
  } else if (sketches[sectionIndex - 1]) {
    let lastStory = sketches[sectionIndex - 1].stories.slice(-1)[0]
    prevLink.href = urlPre + `/?section=${keyfy(sketches[sectionIndex - 1].section)}&sketch=${keyfy(lastStory.title)}`
    prevLink.innerText = "< " + lastStory.title
  } else {
    document.getElementById("prevLink").style.display = "none"
  }

  if (section[sketchIndex + 1]) {
    nextLink.href = urlPre + `/?section=${keyfy(sketches[sectionIndex].section)}&sketch=${keyfy(section[sketchIndex + 1].title)}`
    nextLink.innerText = section[sketchIndex + 1].title + " >"
  } else if (sketches[sectionIndex + 1]) {
    let firstStory = sketches[sectionIndex + 1].stories[0]
    nextLink.href = urlPre + `/?section=${keyfy(sketches[sectionIndex + 1].section)}&sketch=${keyfy(firstStory.title)}`
    nextLink.innerText = firstStory.title + " >"
  } else {
    document.getElementById("nextLink").style.display = "none"
  }


}