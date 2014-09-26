(function(){
	var slimed_code,
		slimGym,
		writeIn = 'slim',
		origin_box,
		new_origin_box,
		slimPretty = true,
	cmInputs = {
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
			this.minify();
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
				data: JSON.stringify({ code: slimed_code, pretty: slimPretty }),
				success: function(resp){
					resp = JSON.parse(resp);
					if(resp.hasOwnProperty('errorMsg')){
						$('#errorZone').html(resp.errorMsg).show();
						return;
					} else {
						$('#errorZone').hide();
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
		},
		htmlClearInput: function(){
			$('#reset').click(function(){
				cmInputs.box_html.setValue('')
				cmInputs.box_slim.setValue('')
				return false;
			});
		},
		routinesArray: {
			"For Loop": ".escape\n  - for i in 1..10\n    | Alright, Sharkbait, here's the plan <br /&gt;",
			"Scss": "scss:\n  $ring_of: 'FIRE';\n  .wannahaukalugee {\n    &:before {\n      content:$ring_of;\n    }\n  }",
			"Coffeescript": "coffee:\n  num = 100\n  claim = while num -= 1\n    'Mine! Mine! Mine!'\n  console.log claim.join(' ')",
			"Math": "- expected_age = 100\nquestion.sea-turtle-lifespan\n  .answer-sandy-plankton #{expected_age} years\n  .answer-marlin[data-experience='You think I would travel the whole ocean and not know as much as Sandy Plankton?'] #{expected_age + 50} years...and still young, dude",
			"Splats": "- shark = 'Bruce'\n- regular_hash = { 'class' => shark.downcase, 'data-rules' => 'Fish are Friends', 'data-background' => 'I never knew my father', 'data-excuse' => 'He never knew his father, mate.' }\n.submarine *regular_hash My name is #{shark}",
			"Interpolation": "- action = 'swimming'\n-for i in 1..3\n .song Just keep #{action}"
		},
		buildRoutines: function(){
			var i = 1, self = this, routinesLength = (this.routinesArray.length + 1);
			var routinesHTML = '<div class="row">'
			$.each(this.routinesArray, function(key, routineValue){
				$('#routinesModal').append('<div class="large-6 medium-6 columns"><div class="slim_gym-routine" data-value="' + routineValue + '"><div class="slim_gym-routine-title slim_gym-title slim_gym-title--sub">' + key + '</div><div class="slim_gym-routine-block"><textarea id="cm' + i + '">' + routineValue +'</textarea></div></div></div>');
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
			$('#openRoutines').click(function(e){
				$('.slim_gym-routine-modal').fadeIn();
				$('body').css('overflow', 'hidden');
				e.preventDefault();
			});
			$(document).on('click', '.slim_gym-routine', function(e){
				cmInputs.box_slim.setValue($(this).attr('data-value'));
				$('.slim_gym-routine-modal').fadeOut();
				$('body').css('overflow', 'initial');
				e.preventDefault();
			});
			$(document).keyup(function(e) {
  				if (e.keyCode == 27) {
  					$('.slim_gym-routine-modal').fadeOut();
  					$('body').css('overflow', 'initial');
  				}
			});
		},
		minify: function(){
			$('#resize').click(function(e){
				slimPretty = $(this).find('i').hasClass('icon-resize')
				if(slimPretty){
					$(this).find('i').addClass('icon-resize2').removeClass('icon-resize');
					$(this).attr('title', 'Minify');
				} else {
					$(this).find('i').removeClass('icon-resize2').addClass('icon-resize')
					$(this).attr('title', 'Expand')
				}
				cmInputs.box_slim.setValue(cmInputs.box_slim.getValue());
				e.preventDefault();
			})
		}
	}
	jQuery(document).ready( function($){
		slimGym.init();
		// box_slim.on('change', toHTML);
	})
}).call(this)