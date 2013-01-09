# easy-grid
This is a javascript lib that helps you to directly show a json array (of objects) as a table, supporting paging.

## What you need
* jQuery lib
* using ajax or any other methods to get your data array ready.

## EASY to use:
You need only write down within 5 lines of codes.

	<div id="table_holder" style="width:100%">
	</div>
	<script>
	var mygrid = easy_grid({"holder":jq('#table_holder')});
	mygrid.cleanView().bindData(data).show(1);

And that's all.

## Features
* Paging
* Plot(not push to github yet)
* Sort on a field both ascending and desending

## Use easy-grid in your own projects
Copy the easy\_grid.js file and easy\_grid.css file into your own directory.
Maybe you need to modify either of them to fulfill your purpose.
For example, you can change \_meaning\_map to giving every field a proper name to fit your data.

