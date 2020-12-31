DIR="/var/tmp/deploy"
mkdir $DIR
cp -r ./* $DIR
rm $DIR/config.mjs
mv $DIR/config-prod.mjs $DIR/config.mjs
rsync --exclude-from=$DIR/exclusions.txt -r $DIR/* michael@104.207.138.106:/var/www/solitaire.michaelpidde.com
rm -rf $DIR