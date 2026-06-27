//#region Time Data

const launch = Temporal.Instant.fromEpochMilliseconds(2695820400000);

const launchZDT = launch.toZonedDateTimeISO(Temporal.Now.timeZoneId());

function update() {
  const now =
    Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZoneId());

  let duration = now.until(launchZDT, {
    largestUnit: 'years',
    smallestUnit: 'milliseconds'
  });

  document.getElementById("time_year").innerText = duration.years;
  document.getElementById("time_month").innerText = duration.months;
  document.getElementById("time_day").innerText = duration.days;
  document.getElementById("time_hour").innerText = duration.hours;
  document.getElementById("time_minute").innerText = duration.minutes;
  document.getElementById("time_seconds").innerText = duration.seconds;

}

update()

document.querySelector(".time_Div").addEventListener("animationend", () => {
  setInterval(() => {
    update()
  }, 500);
}
)
//Temporal.PlainDate.from("2055-05-01").add("13H12M18S");

//#endregion

//#region Header Scroll

let prevScrollPos = window.pageYOffset;

window.onscroll = function () {
  const currentScrollPos = window.pageYOffset;
  const header = document.querySelector("mheader");
  const parrow = document.querySelector("mheader > p");

  if (prevScrollPos > currentScrollPos) {
    header.style.top = "0";
  } else if (prevScrollPos < currentScrollPos) {
    header.style.top = "-100px";
  }

  if (currentScrollPos === 0) {
    parrow.style.opacity = "100%";
  } else {
    parrow.style.opacity = Math.max(0, (100 / currentScrollPos) - 1);
  }

  prevScrollPos = currentScrollPos;
};

//#endregion

//#region Graphical bands

const pleasespeedineedthis = document.querySelector(".animal:nth-child(1)");
const IlookedawayforTWOseconds = document.querySelector(".animal:nth-child(2)");
const container = document.querySelector(".animals");

const offsety = -125;
const scale = 0.5;
const gravity = 0.35; //0.35
const bounce = 0.99; // 1
const friction = 1; // 1

let draggingspeed = false;
let draggingkai = false;

const cforce = 3;

let lastCollisionTime = 0;
let mirror = false;
const objs = [
  {
    el: pleasespeedineedthis,
    x: 50,
    y: 50,
    vx: 4,
    vy: 0,
    squashX: 1,
    squashY: 1
  },
  {
    el: IlookedawayforTWOseconds,
    x: 300,
    y: 20,
    vx: -3,
    vy: 0,
    squashX: 1,
    squashY: 1
  }
];

container.style.position = "relative";
container.style.overflow = "hidden";

for (const o of objs) {
  o.el.style.position = "absolute";
  o.el.style.transformOrigin = "center";
}

function update1() {
  let bounds = container.getBoundingClientRect();

  for (const o of objs) {
    const rect = o.el.getBoundingClientRect();

    const w = rect.width * scale;
    const h = rect.height * scale;

    o.vy += gravity;

    o.x += o.vx;
    o.y += o.vy;

    o.vx *= friction;

    o.squashX += (1 - o.squashX) * 0.15;
    o.squashY += (1 - o.squashY) * 0.15;


    if (o.x <= 0) {
      o.x = 0;
      o.vx *= -bounce;

      o.squashX = 1.35;
      o.squashY = 0.7;
    }


    if (o.x + w >= bounds.width) {
      o.x = bounds.width - w;
      o.vx *= -bounce;

      o.squashX = 1.35;
      o.squashY = 0.7;
    }


    if (o.y <= 0) {
      o.y = 0;
      o.vy *= -bounce;

      o.squashX = 0.7;
      o.squashY = 1.35;
    }


    if (o.y + h >= bounds.height) {
      o.y = bounds.height - h;
      o.vy *= -bounce;


      if (Math.abs(o.vy) < 0.5) {
        o.vy = 0;
      }

      o.squashX = 1.4;
      o.squashY = 0.6;
    }
  }


  const a = objs[0];
  const b = objs[1];

  const ar = a.el.getBoundingClientRect();
  const br = b.el.getBoundingClientRect();

  const aw = ar.width * scale;
  const ah = ar.height * scale;

  const bw = br.width * scale;
  const bh = br.height * scale;

  const dx = (a.x + aw / 2) - (b.x + bw / 2);
  const dy = (a.y + ah / 2) - (b.y + bh / 2);

  const overlapX = (aw / 2 + bw / 2) - Math.abs(dx);
  const overlapY = (ah / 2 + bh / 2) - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    if (overlapX < overlapY) {
      const push = overlapX / 2;
      const dir = dx > 0 ? 1 : -1;

      a.x += push * dir;
      b.x -= push * dir;
    } else {
      const push = overlapY / 2;
      const dir = dy > 0 ? 1 : -1;

      a.y += push * dir;
      b.y -= push * dir;
    }

    if (Date.now() - lastCollisionTime > 50) {
      [a.vx, b.vx] = [b.vx + cforce, a.vx + cforce];
      [a.vy, b.vy] = [b.vy + cforce, a.vy + cforce];

      lastCollisionTime = Date.now();
    }

    mirror = true;
  }

  for (const o of objs) {

    o.el.style.transform = `
            translate(${o.x}px, ${o.y + offsety}px)
            scale(${scale * o.squashX}, ${scale * o.squashY})
            scaleX(${mirror ? -1 : 1})
        `;
  }
  mirror = false;
  
  requestAnimationFrame(update1);
}

setTimeout(() => {
  update1();
}, 1000);


//#endregion

//#region Biography

function encode(e) { return e.replace(/[^]/g, function (e) { return "&#" + e.charCodeAt(0) + ";" }) }

function cssEscape(str) {
  return str.replace(/([^\x00-\x7F]|[!"#$%&'()*+,.\/:;<=>?@\[\\\]^\`{|}~])/g, '\\$1');
}

fetch("profile.json")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    
    for (const profile of data.profiles) {

      let quoteHTML = "";

      //#region Data Validation

      while (profile.css_pallet.length < 8) {
        profile.css_pallet.push("black");
      }

      for (let color of profile.css_pallet) {
        color = color !== "" ? cssEscape(color) : "black";
      }

      while (profile.quote_colors.length < profile.quote.length) {
        profile.quote_colors.push("black");
      }

      while (profile.quote_colors.length > profile.quote.length) {
        profile.quote_colors.pop();
      }

      for (let color of profile.quote_colors) {
        color = color !== "" ? cssEscape(color) : "black";
      }

      //#endregion


      for (let linepos = 0; linepos < profile.quote.length; linepos++) {
        quoteHTML += `<p style="color: ${profile.quote_colors[linepos]};">${profile.quote[linepos]}</p>`;
      }

      const dob = new Date(profile.dob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
      const age = new Date().getFullYear() - dob.getFullYear();

      document.querySelector("#Main-Content").innerHTML += `
        <div class="profile" style="background: ${profile.css_pallet[1]}; border: 2px solid ${profile.css_pallet[2]};">
          <div class="profile-header">
            <h1 style="font-family:${profile.css_pallet[0]}; color: ${profile.css_pallet[3]};">${profile.nicname}</h1>
            <p3 style="font-size: 1em; opacity: 0.85; color: ${profile.css_pallet[4]};">${profile.name}</p3> 
            <span style="font-size: 0.8em; color: ${profile.css_pallet[5]}; opacity: 0.7;">
              <span>${profile.pronouns}</span> |
              <span>${profile.dob === "" ? "~" : age}</span>
            </span>
          </div>

          <img onclick="this.classList.toggle('fs')" class="pfp" id="pfp" src="${profile.avatar}" alt="Profile Picture">
          <p style="color: ${profile.css_pallet[6]};">${profile.about}</p>

          <blockquote>${quoteHTML} <p style="font-style: italic; text-align: right;"> <span> - </span><span style="color: ${profile.css_pallet[7]};">${profile.author}</span></p></blockquote>
        </div>
      `;
    }
  });

//#endregion

//#region Features

//#endregion



/* #region unused code


fetch("profile.json")
  .then(res => res.json())
  .then(data => {
    console.log(data);

    for (const profile of data.profiles) {

      let quoteHTML = "";

      //#region Data Validation

      while (profile.css_pallet.length < 8) {
        profile.css_pallet.push("black");
      }

      for (let color of profile.css_pallet) {
        color = color !== "" ? cssEscape(color) : "black";
      }

      while (profile.quote_colors.length < profile.quote.length) {
        profile.quote_colors.push("black");
      }

      while (profile.quote_colors.length > profile.quote.length) {
        profile.quote_colors.pop();
      }

      for (let color of profile.quote_colors) {
        color = color !== "" ? cssEscape(color) : "black";
      }

      //#endregion


      for (let linepos = 0; linepos < profile.quote.length; linepos++) {
        quoteHTML += `
          <p style="
            color:${profile.quote_colors[linepos]};
            margin:6px 0;
            font-weight:500;
            letter-spacing:0.5px;
          ">
            ${profile.quote[linepos]}
          </p>
        `;
      }

      const dob = new Date(profile.dob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
      const age = new Date().getFullYear() - dob.getFullYear();

      document.querySelector("#Main-Content").innerHTML += `
        <div class="profile"
          style="
            background: ${profile.css_pallet[1]};
            border: 2px solid ${profile.css_pallet[2]};
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 0 25px rgba(212,175,55,0.35);
            backdrop-filter: blur(8px);
            max-width: 700px;
            color: white;
          ">

          <div class="profile-header" style="margin-bottom: 18px;">
            <h1 style="
              font-family:${profile.css_pallet[0]};
              color:${profile.css_pallet[3]};
              margin-bottom: 4px;
              font-size: 2.2em;
              text-shadow: 0 0 12px rgba(255,215,0,0.5);
            ">
              ${profile.nicname}
            </h1>

            <p style="
              font-size:1em;
              opacity:0.9;
              color:${profile.css_pallet[4]};
              margin:0;
            ">
              ${profile.name}
            </p>

            <span style="
              font-size:0.85em;
              color:${profile.css_pallet[5]};
              opacity:0.8;
            ">
              <span>${profile.pronouns}</span> |
              <span>${profile.dob === "" ? "~" : age}</span>
            </span>
          </div>

          <img
            onclick="this.classList.toggle('fs')"
            class="pfp"
            id="pfp"
            src="${profile.avatar}"
            alt="Profile Picture"
            style="
              width:120px;
              height:120px;
              border-radius:50%;
              border:3px solid ${profile.css_pallet[2]};
              box-shadow:0 0 18px rgba(255,215,0,0.45);
              object-fit:cover;
              margin-bottom:18px;
            "
          >

          <p style="
            color:${profile.css_pallet[6]};
            line-height:1.6;
            font-size:1rem;
          ">
            ${profile.about}
          </p>

          <blockquote style="
            margin-top:20px;
            padding:16px;
            border-left:4px solid ${profile.css_pallet[2]};
            background:rgba(255,215,0,0.05);
            border-radius:10px;
          ">
            ${quoteHTML}

            <p style="
              font-style:italic;
              text-align:right;
              margin-top:10px;
            ">
              —
              <span style="color:${profile.css_pallet[7]};">
                ${profile.author}
              </span>
            </p>
          </blockquote>
        </div>
      `;
    }
  });


/* #endregion */