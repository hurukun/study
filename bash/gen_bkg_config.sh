#!/bin/bash

# ./cbkg_pkg.sh image_dir output_file

# the xml header
function outhead(){
	echo "<background>"\
			"<starttime>"\
				"<year>2012</year>"\
				"<month>3</month>"\
				" <day>7</day>"\
				" <hour>00</hour>"\
				"<minute>00</minute>"\
				"<second>00</second>"\
			"</starttime>" > ${1}
}

# the xml items
function tmpl(){
	echo "<static>"\
		 "<duration>${3}</duration>"\
		 "<file>${1}</file>"\
		 "</static>"\
		 "<transition type='overlay'>"\
		 "	<duration>1</duration>"\
		 "	<from>${1}</from>"\
		 "	<to>${2}</to>"\
		 "</transition>" >> ${4}
}

# the xml tail
function outtail(){
	echo "</background>">>${1}
}

#image path
path=${1}
#output file path
output=${2}

list=($(ls ${path}))

listLen=${#list[*]}

let "duration=24*3600/listLen"

outhead ${output}

for (( k=0; k<listLen - 1; k++));do
	tmpl ${path}${list[k]} ${path}${list[k+1]} ${duration} ${output}
done

outtail ${output}
