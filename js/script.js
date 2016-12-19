String.prototype.format=function()  
{  
	if (arguments.length == 0)
		return this;  

	for (var s = this, i = 0; i < arguments.length; i++)  
		s = s.replace(new RegExp("\\{"+ i +"\\}", "g"), arguments[i]);  

  	return s;  
}


function verify_login(username, password)
{
	if (username == "admin" && password == "admin")
		return true;

	return false;
}

function login() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	console.log('username: ', username);
	console.log('password: ', password);

	if (verify_login(username, password))
		location.href = 'query.html';
	else
	{
		alert("用户名或密码错误！");
		return;
	}
}


function load_brand_query_result(file, material_name, levels)
{
	Papa.parse(file, {
		skipEmptyLines: true,
		header: false,
		complete: function(results) {
			console.log("Finished:", results);

			// 内容
			var data = results.data, html;

			for (var i = 1, _I = data.length; i < _I - 1; i++)
			{
				var item = data[i];

				var name = data[i][2];
				var flag1 = data[i][1];
				var flag2 = data[i][2];
				var level = data[i][3];
				var brand = new Array();

				for (var j = 4; j < item.length; j++)
				{
					if (!item[j] || item[j] == '')
						continue;
					brand.push('[' + item[j] + ']  ');
					if (j % 10 == 0)
						brand.push('<br>');
				}

				if (name.indexOf(material_name) == -1 || (levels.length > 0 && levels.indexOf(level) == -1))
					continue;

				html += "<tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\">"
				html += "<td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td><pre>{4}</pre></td>".format(name, flag1, flag2, level, brand.join(''));
				html += "</tr>";
			}

			$("#result tbody").html(html);
		}
	});	
}


function brand_query() {
	var material_name = document.getElementById("material_name").value;
	var level = document.getElementsByName("level");
	var files = document.getElementById("datasource").files;

	// 数据源
	if (files.length <= 0)
	{
		alert("请选择数据源");
		return;
	}

	// 材料名称
	if (material_name.length <= 0 || material_name == '请输入材料名称')
	{
		alert("请输入材料名称");
		return;
	}

	// 档次
	var levels = new Array();
	for (var i = 0; i < level.length; i++)
	{
		if (level[i].checked)
			levels.push(level[i].value);
	}

	console.log('material_name: ', material_name);
	console.log('levels: ', levels);

	load_brand_query_result(files[0], material_name, levels);
}



function load_price_query_result(file, material_name, brand, spec, material_quality, firm)
{
	Papa.parse(file, {
		skipEmptyLines: true,
		header: false,
		complete: function(results) {
			console.log("Finished:", results);

			// 内容
			var data = results.data, html;

			for (var i = 1, _I = data.length; i < _I - 1; i++)
			{
				var item = data[i];

				var material_name_tmp = data[i][2];
				var brand_tmp = data[i][3];
				var spec_tmp = data[i][4];
				var material_quality_tmp = data[i][5];
				var firm_tmp = data[i][10];

				if (material_name.length > 0 && material_name != "材料名称" && material_name_tmp.indexOf(material_name) == -1)
					continue;
				if (brand.length > 0 && brand != "品牌" && brand_tmp != brand)
					continue;
				if (spec.length > 0 && spec != "规格" && spec_tmp != spec)
					continue;
				if (material_quality.length > 0 && material_quality != "材质" && material_quality_tmp != material_quality)
					continue;
				if (firm.length > 0 && firm != "厂商" && firm_tmp != firm_tmp)
					continue;

				html += "<tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\">"
				for (var j = 0; j < item.length; j++)
					html += "<td>{0}</td>".format(item[j]);				
				html += "</tr>";
			}

			$("#result tbody").html(html);
		}
	});	
}


function price_query() {
	var material_name = document.getElementById("material_name").value;
	var brand = document.getElementById("brand").value;
	var spec = document.getElementById("spec").value;
	var material_quality = document.getElementById("material_quality").value;
	var firm = document.getElementById("firm").value;
	var files = document.getElementById("datasource").files;

	// 数据源
	if (files.length <= 0)
	{
		alert("请选择数据源");
		return;
	}

	// 筛选项
	if ((material_name.length <= 0 || material_name == '材料名称') 
		&& (brand.length <= 0 || brand == "品牌")
		&& (spec.length <= 0 || spec == "规格")
		&& (material_quality.length <= 0 || material_quality == "材质")
		&& (firm.length <= 0 || firm == "厂商"))
	{
		alert("请至少输入一项");
		return;
	}

	console.log('material_name: ', material_name);
	console.log('brand: ', brand);
	console.log('spec: ', spec);
	console.log('material_quality: ', material_quality);
	console.log('firm: ', firm);

	load_price_query_result(files[0], material_name, brand, spec, material_quality, firm);
}



