# easy-grid
This is a javascript lib that helps you to directly show a json array (of objects) as a table, supporting paging.

## License
New BSD License

## What you need
* jQuery lib
* using ajax or any other methods to get your data array ready.

## Easy to use:
You need only write down within 5 lines of codes.

	<div id="table_holder" style="width:100%"> </div>
	<script>
	var mygrid = easy_grid({"holder":jq('#table_holder')});
	mygrid.cleanView().bindData(data).show(1);
	</script>

And that's all.
Note that only the last line is useful to redraw the grid.
It means you can recreate a new table each time you receive ajax data.

## Your Data format
You need a very simple data format. Data in that format can be easily generated by some background program like php or something else.

data: [ obj, obj, obj, ... ] an array of obj
obj: { fieldA: 123, fieldB: 'hello', fieldC: '2012-01-01', ... }

The data can be an object unserialized from a json string, or retrieved directly from a SQL database.

## Features
* Paging
* Plot(use [ico](http://alexyoung.github.com/ico/) and [raphael](http://raphaeljs.com/))
* Sort on a field both ascending and desending

## Use easy-grid in your own projects
Copy the easy\_grid.js file and easy\_grid.css file into your own directory.
Maybe you need to modify either of them to fulfill your purpose.
For example, you can change \_meaning\_map to giving every field a proper name to fit your data.

And because of the dependencies on ico & raphael, you may also copy raphael.js and ico.min.js to your project's directory.
If you want any other representation of the chart, refer to ico documentation and change easy\_grid.js file.

