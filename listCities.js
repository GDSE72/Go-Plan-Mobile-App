const fs = require("fs");
const data = JSON.parse(
  fs.readFileSync("Big_Sri_Lanka_Travel_Data.json", "utf8"),
);

let found = false;
data.forEach((p) => {
  if (p.districts) {
    p.districts.forEach((d) => {
      if (d.district_name === "Galle") {
        console.log("FOUND DISTRICT: Galle in", p.province_name);
        found = true;
      }
      if (d.cities) {
        d.cities.forEach((c) => {
          if (c.city_name === "Galle" || c.city_name.includes("Galle")) {
            console.log(
              "FOUND CITY:",
              c.city_name,
              "in",
              p.province_name,
              ">",
              d.district_name,
            );
            found = true;
          }
        });
      }
    });
  }
});
if (!found) console.log("Galle NOT FOUND");
