(function(){
	jQuery(document).ready( function($){
		var parsed_html;
		$('#slim_code').keyup(function(e){

			$.ajax({
				type:"POST",
				url: '/convert',
				data: JSON.stringify({ code: $('#slim_code').val() }),
				success: function(resp){
					parsed_html = JSON.parse(resp).render;
					$('#slim_output').html(parsed_html);
					parsed_html = parsed_html.replace(/>\n/g, '>');
					parsed_html = parsed_html.replace(/\n</g, '<');
					parsed_html = parsed_html.replace(/> /g, '>');
					parsed_html = parsed_html.replace(/></g, '>\n<');
					parsed_html = parsed_html.replace(/ /g, '&nbsp;');
					parsed_html = parsed_html.replace(/</g, '&lt;');
					parsed_html = parsed_html.replace(/\n/g, '<br />');
					console.log(parsed_html)
					$('#slim_text').html(parsed_html);
				}
			});
		});
	})
}).call(this)