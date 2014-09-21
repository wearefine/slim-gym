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
			lineNumbers: true,
			lineWrapping: true
		}),
		box_html: CodeMirror.fromTextArea(document.getElementById("box_html"), {
			lineNumbers: false,
			mode: "application/x-ejs",
			matchBrackets: true,
			theme: 'slim-gym',
			tabSize: 2,
			highlightSelectionMatches: true,
			styleActiveLine: false,
			lineNumbers:true,
			lineWrapping:true
		})
	};
	slimGym = {
		init: function(){
			this.htmlToggleInput();
			cmInputs.box_html.on('focus', this.toggleInput);
			cmInputs.box_slim.on('focus', this.toggleInput);
			cmInputs.box_slim.setValue("h1 Grab shell, dude\n- for i in 1..3\n  | P Sherman 42 Wallaby Way Sydney <br />\n.lets-ask-for-directions\n  - ['dooo', 'eeee', 'wooo'].each do |whale_speak|\n    = whale_speak\n  /! Dory you can't speak whale\nmarkdown:\n  ## He touched the butt")
			this.displayCode(cmInputs.box_slim)
		},
		displayCode: function(cm){
			var target;
			slimed_code = cm.getValue();
			if(slimed_code.indexOf('<%') && writeIn == 'html'){
				slimed_code = slimed_code.replace(/<\%/g, '<%25');
				slimed_code = slimed_code.replace(/\%>/g, '%25>');
				cmInputs.box_slim.setOption('readOnly', true);
			} else {
				cmInputs.box_slim.setOption('readOnly', false);
			}
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
						$('#errorZone').html(resp.errorMsg).show();
						return;
					} else {
						$('#errorZone').hide();
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