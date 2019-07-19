for x in  images/*.jpeg images/*.jpg images/*.gif images/*.png;
do mogrify -resize "96x96^" -gravity center -crop 96x96+0+0 +repage $x;
done
