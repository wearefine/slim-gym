(function(){
	var slimed_code, slimGym, writeIn = 'slim', origin_box, new_origin_box;
	var cmInputs = {
		box_slim: CodeMirror.fromTextArea(document.getElementById("box_slim"), {
			mode: 'slim',
			theme: 'slim-gym',
			tabSize: 2,
			highlightSelectionMatches: true,
			styleActiveLine: true,
			lineNumbers: true,
			lineWrapping: true
		}),
		box_html: CodeMirror.fromTextArea(document.getElementById("box_html"), {
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
			this.htmlClearInput();
			this.buildRoutines();
			this.openRoutines();
		},
		displayCode: function(cm){
			var target;
			slimed_code = cm.getValue();
			if(writeIn == 'html'){
				target = cmInputs.box_slim;
				slimed_code = slimed_code.replace(/<\%/g, '<%25');
				slimed_code = slimed_code.replace(/\%>/g, '%25>');
				cmInputs.box_slim.setOption('readOnly', true);
			} else {
				target = cmInputs.box_html;
				cmInputs.box_slim.setOption('readOnly', false);
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
					$('body').html(resp.responseText)
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
		},
		htmlClearInput: function(){
			$('#reset').click(function(){
				cmInputs.box_html.setValue('')
				cmInputs.box_slim.setValue('')
				return false;
			});
		},
		routinesArray: {
			"For Loop": "- for i in 1..10\n  = i",
			"Scss": "scss:\n  $fire:'Ring of';\n  .wannahaukalugee {\n    &:before {\n      content:$fire;\n    }\n  }",
			"Coffeescript": "coffee:\n  console.log 'He touched the butt'",
			"Math": "- base_int = 10\n= base_int * 20",
			"Splats": "- regular_hash = { 'class' => 'bruce', 'data-rules' => 'Fish are Friends', 'data-background' => 'I never knew my father', 'data-excuse' => 'He never knew his father, mate.' }\n.submarine *regular_hash Esscaahhpay",
			"Interpolation": "- action = 'swimming'\n-for i in 1..3\n .song Just keep #{action}"
		},
		buildRoutines: function(){
			var i = 1, self = this, routinesLength = (this.routinesArray.length + 1);
			var routinesHTML = '<div class="row">'
			$.each(this.routinesArray, function(key, routineValue){
				$('#routinesModal').append('<div class="large-6 medium-6 columns"><div class="slim_gym-routine" data-value="' + routineValue + '"><div class="slim_gym-routine-title slim_gym-title">' + key + '</div><div class="slim_gym-routine-block"><textarea id="cm' + i + '">' + routineValue +'</textarea></div></div></div>');
				var cmRoutine = CodeMirror.fromTextArea($('#cm' + i).get(0), {
					mode: "slim",
					matchBrackets: true,
					theme: 'slim-gym',
					tabSize: 2,
					highlightSelectionMatches: true,
					lineNumbers:true,
					lineWrapping:true,
					value: routineValue,
					readOnly: true
				});
				i++;
			});
			$('.slim_gym-routine-modal').hide();
		},
		openRoutines: function(){
			$('#openRoutines').click(function(){
				$('.slim_gym-routine-modal').show();
				$('body').css('overflow', 'hidden');
			});
			$(document).on('click', '.slim_gym-routine', function(){
				cmInputs.box_slim.setValue($(this).attr('data-value'));
				$('.slim_gym-routine-modal').hide();
				$('body').css('overflow', 'initial');
			});
		}
	}
	jQuery(document).ready( function($){
		slimGym.init();
		// box_slim.on('change', toHTML);
	})
}).call(this)