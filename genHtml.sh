#!/bin/bash

# Copyright (c) 2016 Maxwell Dreytser

for D in `find . -type d`;
do
	if [[ $D != *'.git'* ]]; then
		SubDir=${D/\.\//};
		
		echo ${SubDir};
		
		(
			cd $SubDir;
			
			echo '<html>' > index.html;
			echo '    <head>' >> index.html;
			echo "        <title>SpeechBubble.js - ${SubDir}</title>" >> index.html
			echo '    </head>' >> index.html;
			echo '    <body>' >> index.html;
			echo '        <h1>File List</h1>' >> index.html;
			if [[ $SubDir != '.' ]]; then
				echo "        <h3>${SubDir}</h3>" >> index.html;
				echo '        <h5><a href="../">Go to Parent Directory</a></h5>' >> index.html;
			else
				echo "        <h3>(root)</h3>" >> index.html;
			fi
			echo '        <table border="1">' >> index.html;
			echo '            <tr>' >> index.html;
			echo '                <th>Item Name</th>' >> index.html;
			echo '                <th>Type</th>' >> index.html;
			echo '            </tr>' >> index.html;
			
			for SubD in `find -mindepth 1 -maxdepth 1 -type d | sed -e 's/\.\///g'`; do
				echo "    $SubD";
				
				if [[ $SubD != *'.git'* ]]; then
			echo '            <tr>' >> index.html;
			echo "                <td><a style=\"padding: 5px 7px\" href=\"$SubD\\\">$SubD</a></td>" >> index.html;
			echo '                <td>Folder</td>' >> index.html;
			echo '            </tr>' >> index.html;
				fi
			done;
			
			for SubFile in `find -mindepth 1 -maxdepth 1 -not -path '*/\.*' -type f | sed -e 's/\.\///g'`; do
				
				if [[ $SubFile != 'index.html' && $SubFile != 'genHtml.sh' ]]; then
					echo "    $SubFile";
				
			echo '            <tr>' >> index.html;
			echo "                <td><a style=\"padding: 5px 7px\" href=\"$SubFile\">$SubFile</a></td>" >> index.html;
			echo '                <td>File</td>' >> index.html;
			echo '            </tr>' >> index.html;
				
				fi
				
			done;
			
			echo '        </table>' >> index.html;
			echo '    </body>' >> index.html;
			echo '</html>' >> index.html;
		)
	fi
done;
