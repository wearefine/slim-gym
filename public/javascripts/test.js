(function(){
	jQuery(document).ready( function($){
		var parsed_html, slimed_code,
		toHTML = function(cm, cmobject){
			slimed_code = cm.getValue()
			$.ajax({
				type:"POST",
				url: '/convert2html',
				data: JSON.stringify({ code: slimed_code }),
				success: function(resp){
					parsed_html = JSON.parse(resp).render;
					$('#slim_output').html(parsed_html);
					slim_output.setValue(parsed_html);
				}
			});
		},
		toSlim = function(cm, cmobject){
			slimed_code = cm.getValue()
			$.ajax({
				type:"POST",
				url: '/convert2slim',
				data: JSON.stringify({ code: slimed_code }),
				success: function(resp){
					parsed_html = JSON.parse(resp).render;
					slim_input.setValue(parsed_html);
				}
			});
		},
		slim_input = CodeMirror.fromTextArea(document.getElementById("slim_code"), {
			lineNumbers: false,
			mode: 'slim',
			theme: 'tomorrow-night-eighties',
			tabSize: 2
		}),
		slim_output = CodeMirror.fromTextArea(document.getElementById("slim_text"), {
			lineNumbers: false,
			mode: 'text/html',
			matchBrackets: true,
			theme: 'tomorrow-night-eighties',
			tabSize: 2
		});
		slim_input.on('change', toHTML);
		// slim_output.on('change', toSlim);
	})
}).call(this)