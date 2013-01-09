// Source: easy_grid.js
// BSD license
//

(function(jq, scope) {

	// easy_grid is a closure ensure data members are private
	// and not visible for an object
	scope.easy_grid = function(conf) {
		var _data = conf.data || {}
		, _holder = conf.holder || {}
		, _fields = conf.fields || []
		, _paging = conf.paging || 10
		, _grid_name = conf.name || ''
		, _enable_sorting = (conf.sort === false ? false : true)
		, _cur_page = 1
		, _sort_field = ''
		, _sort_type = 'asc'
		, _graph;

		var _meaning_map = {
			'place':'观测点',
			'so2cons':'SO2一小时浓度',
			'so2index':'SO2一小时分指数',
			'no2cons':'NO2一小时分指数',
			'no2index':'NO2一小时分指数',
			'mess':'颗粒物浓度',
			'qua_lv':'空气质量级别',
			'qua_class':'空气质量指数类型',
		};

		var _dynamicSortAsc = function(property) {
			return function(a,b) {
				return (a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0);
			}
		};
		
		var _dynamicSortDesc = function(property) {
			return function(a,b) {
				return (a[property] > b[property]) ? -1 : ((a[property] < b[property]) ? 1 : 0);
			}
		};

		var _ascClick = function(obj) {
			return function() {
				var el = jq(this);
				var name = el.parent('td').find('.head_field').attr('name');
				obj.sortDataAsc(name).cleanView().show().showPlot();
			}
		};

		var _descClick = function(obj) {
			return function() {
				var el = jq(this);
				var name = el.parent('td').find('.head_field').attr('name');
				obj.sortDataDesc(name).cleanView().show().showPlot();
			}
		};

		var _movePrevClick = function(obj) {
			return function() { obj.movePrev().cleanView().show().showPlot(); }
		};
		
		var _moveNextClick = function(obj) {
			return function() { obj.moveNext().cleanView().show().showPlot(); }
		};

		return {
			bindData: function(data) { _data = data; return this; },
			bindGraph: function(g) { _graph = g; return this; },

			getHolder: function() { return _holder; },

			cleanView: function() { _holder.empty(); return this; },

			getFields: function() { return _fields; },
			setFields: function(fields) { _fields = fields; return this; },

			detectFields: function() {
				if (_data
					&& typeof _data === 'array'
					&& _data.length > 0
					&& typeof(_data[0]) === 'object') {
					_fields = [];
					for (var key in _data[0])
						_fields.push(key);
				}
				return this;
			},

			sortDataAsc: function(on_field) {
				_sort_field = on_field;
				_data.sort(_dynamicSortAsc(_sort_field));
				_sort_type = 'asc';
				return this;
			},

			sortDataDesc: function(on_field) {
				_sort_field = on_field;
				_data.sort(_dynamicSortDesc(_sort_field));
				_sort_type = 'desc';
				return this;
			},

			movePrev: function() { if (_cur_page > 0) _cur_page--; return this; },
			moveNext: function() { if (this.getShowPage() < this.getPageCount()) _cur_page++; return this; },

			getPageCount: function() { return Math.ceil(_data.length / _paging); },

			getShowPage: function() { return _cur_page + 1; },
			setShowPage: function(show_page) { _cur_page = show_page || _cur_page || 0; return this; },

			getPageSize: function() { return _paging; },
			setPageSize: function(paging) { _paging = paging; return this; },

			_getPagingHtml: function() {
				var html = '';
				if (_cur_page > 0)
					html += '<a href="#" type="move_prev">&lt;--</a>&nbsp;';
				html += this.getShowPage() + ' of ' + this.getPageCount();
				if (this.getShowPage() < this.getPageCount())
					html += '&nbsp;<a href="#" type="move_next">--&gt;</a>';
				return html;
			},

			_getSortHtml: function(field_name) {
				var html = '';
				html += '<a href="#" type="asc_sort"><span style="font-size:9px">ASC</span></a>&nbsp;';
				html += '<a href="#" type="desc_sort"><span style="font-size:9px">DESC</span></a>';
				return html;
			},

			show: function(show_page) {
				var key = '';
				var fi = 0;
				var id = 0;
				_cur_page = show_page ? (show_page - 1) : (_cur_page || 0);

				if (this.getPageCount() === 0) {
					_holder.append('no data');
					_cur_page = 0;
					return this;
				}
				_holder.empty();

				var new_html = '';

				new_html += '<div class="easy_grid_style">';
				//new_html += '<div>'
				new_html += this._getPagingHtml() + '<br/>';
				new_html += '<table>';

				// write header
				new_html += '<tr>';
				if (_fields && typeof(_fields) == 'array') {
					for (fi = 0; fi < _fields.length; fi++) {
						new_html += '<td><span class="head_field" name="'+_fields[fi]+'">' + _meaning_map[_fields[fi]] + '</span>';
						if (_enable_sorting)
							new_html += '<br/>' + this._getSortHtml(_fields[fi]);
						new_html += '</td>';
					}
				} else {
					for (key in _data[id]) {
						new_html += '<td><span class="head_field" name='+key+'>' + _meaning_map[key] + '</span>';
						if (_enable_sorting)
							new_html += '<br/>' + this._getSortHtml(key);
						new_html += '</td>';
					}
				}
				new_html += '</tr>';

				// write body
				for (id = _paging * _cur_page; id < _data.length && id < (_cur_page + 1) * _paging; id++) {
					new_html += '<tr>';
					if (_fields && typeof(_fields) == 'array')
						for (fi = 0; fi < _fields.length; fi++)
							new_html += '<td>' + _data[id][_fields[fi]] + '</td>';
					else
						for (key in _data[id])
							new_html += '<td>' + _data[id][key] + '</td>';
					new_html += '</tr>';
				}

				new_html += '</table>';
				new_html += '</div>';

				var obj = this;
				_holder.append(new_html);
				_holder.find('a[type="asc_sort"]').click( _ascClick(obj));
				_holder.find('a[type="desc_sort"]').click(_descClick(obj));
				_holder.find('a[type="move_prev"]').click(_movePrevClick(obj));
				_holder.find('a[type="move_next"]').click(_moveNextClick(obj));

				return this;
			},

			showPlot: function(graph_obj) {
				// TODO: add lines to plot data
				return this;
			}
		};
	};


})(jQuery, this);


