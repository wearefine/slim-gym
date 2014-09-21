(function(){
	var slimed_code, slimGym, writeIn = 'slim', origin_box, new_origin_box;
	var cmInputs = {
		box_slim: CodeMirror.fromTextArea(document.getElementById("box_slim"), {
			lineNumbers: false,
			mode: 'slim',
			theme: 'slim-gym',
			tabSize: 2,
			highlightSelectionMatches: true,
			styleActiveLine: true,
		}),
		box_html: CodeMirror.fromTextArea(document.getElementById("box_html"), {
			lineNumbers: false,
			mode: "application/x-ejs",
			matchBrackets: true,
			theme: 'slim-gym',
			tabSize: 2,
			highlightSelectionMatches: true,
			styleActiveLine: false,
		})
	};
	slimGym = {
		init: function(){
			this.htmlToggleInput();
			cmInputs.box_html.on('focus', this.toggleInput);
			cmInputs.box_slim.on('focus', this.toggleInput);
		},
		displayCode: function(cm, cmobject){
			var target;
			slimed_code = cm.getValue();
			slimed_code = slimed_code.replace(/<\%/g, '<%25');
			slimed_code = slimed_code.replace(/\%>/g, '%25>');
			if(writeIn == 'html'){
				target = cmInputs.box_slim;
			} else {
				target = cmInputs.box_html;
			}
			$.ajax({
				type:"POST",
				url: '/convert-' + writeIn,
				data: JSON.stringify({ code: slimed_code }),
				success: function(resp){
					resp = JSON.parse(resp);
					if(resp.hasOwnProperty('errorMsg')){
						$('#errorZone').html(resp.errorMsg)
						return;
					} else {
						$('#errorZone').empty();
						if(writeIn == 'slim') {
							$('#box_compiled').html(resp.html);
						} else {
							if(resp.compiled != '')
								$('#box_compiled').html(resp.compiled);
						}
						target.setValue(resp.html);
					}
				},
				error: function(resp, status, err){
					$('#errorZone').html('Completely Unexpected Error');
					// console.log(JSON.stringify(resp));
				}
			});
		},
		toggleInput: function(cm){
			if(cm.getOption('mode') == 'slim'){
				origin_box = cmInputs.box_html;
				new_origin_box = cmInputs.box_slim;
				writeIn = 'slim';
			} else {
				origin_box = cmInputs.box_slim
				new_origin_box = cmInputs.box_html
				writeIn = 'html'
			}
			origin_box.off('change', slimGym.displayCode);
			origin_box.setOption('styleActiveLine', false);
			new_origin_box.on('change', slimGym.displayCode);
			new_origin_box.setOption('styleActiveLine', true);
		},
		htmlToggleInput: function(){
			var self = this;
			$('.js-slim_gym-switch').click(function(){
				self.toggleInput($(this).attr('data-lang'));
			});
		}
	}
	jQuery(document).ready( function($){
		slimGym.init();
		// box_slim.on('change', toHTML);
	})
}).call(this)