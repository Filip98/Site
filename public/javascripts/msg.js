// @license magnet:?xt=urn:btih:0ef1b8170b3b615170ff270def6427c317705f85&dn=lgpl-3.0.txt LGPL-3.0
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checker(el) {
  el = el.split(",");
  for(let i = 0;i < el.length;i++) {
    const e = document.getElementById(el[i]);
    if (e && !e.value)
      return false;
  }
  return true;
}

function rmsg() {
  document.getElementById("message").innerHTML = "";
}

async function message(lang="", el="null") {
  rmsg();
  await sleep(60);
  let text="Language not specified";
  if (!checker(el)) {
    switch(lang) {
      case "en":
        text = "You must fill the required fields";break;
      case "sr":
        text = "Morate popuniti neophodna polja";break;
    }

    document.getElementById("message").innerHTML = text;
    return false;
  }

  switch(lang) {
    case "en":
      text = "Your request has been successfully received!";break;
    case "sr":
      text = "Vas zahtev je uspesno primljen!";break;
  }

  document.getElementById("message").innerHTML = text;
}

/*function formdata(form = 0) {
  let x = document.forms[form];
  let res = x.elements[0].name + "=" + x.elements[0].value;
  for (let i = 1;i < x.length;i++)
    res += "&" + x.elements[i].name + "=" + x.elements[i].value;
}*/

let i;
function elvalue(value) {
  let el = document.getElementById(value);
  if (el)
    value = el.value;
  else
    if (value.match(/^ii/)) {
      value=elvalue(String(i) + value.substring(1, value.length));
      i = 0;
    } else {
      el = document.getElementsByName(value);
      if (el)
        if (el.length > 1)
          for(i = 0;i < el.length;i++)
            if (el[i].checked) {
              value = el[i].value;break;
            }
        else
          value = el[0].value;
    }

  return value;
}

async function req({data = "", ev = "", url = "", method = "POST", lang = "", el = ""} = {}) {
  if (checker(el)) {
    if (ev !== "" && method !== "async")
      ev.preventDefault();

    /*if (data.match(/^form/))
      data=formdata(data.substring(4,value.length));
    else */if (data !== "" && data.split("=")[0] === data) {
      let msg = data.split(",");
      data = msg[0]+ "=" + elvalue(msg[0]);
      for(let i = 1;i < msg.length;i++)
        data += "&" + msg[i] + "=" + elvalue(msg[i]);
    }

    if (method === "async")
      navigator.sendBeacon(url, data);
    else {
      await fetch(url, {
        method: method,
        //if (method === "POST")
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        body: data
      });
      if (ev !== "")
        location.href = ev.target.href;
    }
  }

  if (lang !== "")
    message(lang,el);
}
// @license-end
