import { google } from "googleapis";
import express from "express";
import cors from "cors";
import url from "url";
import dotEnv from "dotenv";
dotEnv.config();

const app = new express();

app.use(cors());
app.use(express.json({ extended: false }));

// *! google

const authGuy = new google.auth.OAuth2({
  clientId: process.env.gapiClient_ID,
  clientSecret: process.env.gapiClient_secret,
  redirectUri: process.env.redirectURI,
});

let scopes = ["https://www.googleapis.com/auth/youtube"];

let AuthURL = authGuy.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
  redirect_uri: process.env.redirectUri,
  client_id: process.env.clientId,
});
console.log(AuthURL);

app.get("/", (req, res) => {
  let current = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(current);
  let q = url.parse(current, true).query;
  console.log(q);

  if (!q.error) {
    authGuy
      .getToken(q.code)
      .then((res2) => {
        authGuy.setCredentials(res2.tokens);
        console.log(res2.tokens);
        console.log("TOKENS");
        const yt = google.youtube({
          auth: authGuy,
          version: "v3",
        });
        // yt.videos
        //   .getRating({
        //     auth: authGuy,
        //     id: "BwiqSuv6Mgc",
        //   })
        //   .then((resGetRate) => {
        //     console.log("RES get rate", resGetRate.data);

        //     res.send("RES get data");
        //   })
        //   .catch((errGetRate) => {
        //     console.log("err  GET rate", errGetRate);
        //     res.send("err rate");
        //   });
        // yt.videos
        //   .rate({
        //     auth: authGuy,
        //     id: "_5SHTJMVlWk",
        //     rating: "like",
        //   })
        //   .then((resRate) => {
        //     console.log("resRate", resRate.data);
        //     res.send("RES RATE");
        //   })
        //   .catch((errRate) => {
        //     console.log("errRate", errRate);
        //     res.send("ERR rate");
        //   });
        // yt.videos
        //   .list({
        //     auth: authGuy,
        //     part: ["snippet,contentDetails,statistics"],
        //     myRating: "like",
        //   })
        //   .then((responsenew) => {
        //     console.log("RESPONSE LIST", responsenew.data);
        //     res.send("LISTED");
        //   })
        //   .catch((errList) => {
        //     console.log("ERRLIST", errList);
        //     res.send("SOME ERROR");
        //   });
        let titleNew = 0;
        setInterval(() => {
          yt.videos
            .update({
              id: "BwiqSuv6Mgc",
              auth: authGuy,
              part: ["snippet"],
              resource: {
                id: "BwiqSuv6Mgc",
                snippet: {
                  title: `Current count _:_ ${titleNew} _:_SEE DESCRIPTION`,
                  categoryId: 22,
                  description: `The current title is "Current count _:_ ${titleNew} _:_ SEE DESCRIPTION".\nThis title increases itself by 1 every 8 minutes, so keep comming back to see how far it has gone.\nIf the code doesn't fail, it will take about 5 days for the title to hit 1,000, one and a half year for 100,000 and about 15 years to hit 1,000,000.\nI would love to see it hit a million in 15 years, if the code broke or it is stuck please let me know at bimalpandey32@gmail.com`,
                },
              },
            })
            .then((response) => {
              titleNew++;
              console.log(response.data);
              console.log("DONE");
            })
            .catch((err) => {
              console.log(err);
              console.log("NOT DONE");
            });
        }, 1000 * 8*60);
      })
      .catch((err) => {
        console.log(err);
        console.log("TOKEN EROR");
      });
  }
  // !

  // const vId = "BwiqSuv6Mgc";

  // yt.videos
  //   .list({
  //     id: vId,
  //     part: "snippet,statistics",
  //     auth: authGuy,
  //   })
  //   .then((res) => {
  //     console.log(res.data.items);
  //     console.log("RESPONSE");
  //     // jwt.authorize((err5, res5) => {
  //     let yt2 = google.youtube({
  //       auth: jwt,
  //       version: "v3",
  //     });
  //     yt.videos
  //       .update({
  //         id: "BwiqSuv6Mgc",
  //         auth: authGuy,
  //         part: "snippet",
  //         snippet: {
  //           title: "65 dumb seconds",
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //         console.log("DONE");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         console.log("NOT DONE");
  //       });
  //     // });
  //     // yt.videos
  //     //   .update({
  //     //     id: "BwiqSuv6Mgc",
  //     //     part: ["snippet"],
  //     //     snippet: {
  //     //       title: "65 dumb seconds",
  //     //     },
  //     //   })
  //     //   .then((response) => {
  //     //     console.log(response.data);
  //     //     console.log("DONE");
  //     //   })
  //     //   .catch((err) => {
  //     //     console.log(err);
  //     //     console.log("NOT DONE");
  //     //   });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     console.log("ERR");
  //   });
  // axios
  //   .get(
  //     url
  //     "https://youtube.googleapis.com/youtube/v3/search?part=game%20of%20thrones&key="+process.env.apiKey
  //   )
  //   .then((res) => {
  //     console.log(res.data.items);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     console.log("ERRR");
  //   });

  // let urlUpdate = `${baseURL}/videos?part=snippet&key=${process.env.apiKey}`;
  // res.send("NOT DNE");
  // axios
  //   .post(urlUpdate, {
  //     id: "BwiqSuv6Mgc",
  //     snippet: { title: "65 seconds of nothingness", description: "Sike I Lied" },
  //   })
  //   .then((res) => console.log(res.data))
  //   .catch((err) => console.log(err));
});

app.get("/oauth3", (req, res) => {
  console.log(AuthURL);
  console.log("PLEASE WORK");
  res.redirect(302, AuthURL);
});

// app.get(/oauth2callback.*/, (req, res) => {
//   let current = req.protocol + "://" + req.get("host") + req.originalUrl;
//   console.log(current);
//   let q = url.parse(current, true).query;
//   console.log(q);
//   if (!q.error) {
//     authGuy
//       .getToken(q.code)
//       .then((res) => {
//         authGuy.setCredentials(res.tokens);
//         console.log(res.tokens);
//         yt.videos
//           .update({
//             id: "BwiqSuv6Mgc",
//             auth: authGuy,
//             part: "snippet",
//             snippet: {
//               title: "65 dumb seconds",
//             },
//           })
//           .then((response) => {
//             console.log(response.data);
//             console.log("DONE");
//           })
//           .catch((err) => {
//             console.log(err);
//             console.log("NOT DONE");
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// });
app.listen(process.env.PORT || 5000, () =>
  console.log("LISTENING on PORT " + process.env.PORT || 5000)
);
