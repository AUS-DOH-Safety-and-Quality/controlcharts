git clone https://github.com/AUS-DOH-Safety-and-Quality/PowerBI-SPC
cd PowerBI-SPC/
npm install
npm run bundle
mv .tmp/build/PBISPC.js ../inst/htmlwidgets/lib/PBISPC/
PBIVER=$(jq '.visual.version' pbiviz.json | sed 's/"//g')

sed -i "/- name: PBISPC/{n;s/version: .*/version: $PBIVER/;}" ../inst/htmlwidgets/spc.yaml
cd ..
rm -rf PowerBI-SPC/
