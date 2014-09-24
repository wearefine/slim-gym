require 'bundler/setup'
require 'rubygems'
require 'sass'
require 'sinatra'
require 'slim'
require 'json'
require 'slim/erb_converter'
require 'html2slim'
require 'redcarpet'
require 'coffee-script'

Slim::Engine.default_options[:pretty] = true

set :scss, {
  :style => :compact,
}

get '/' do
  Slim::Template.new("index.slim", {}).render(self)
end

post '/convert-html' do
  begin
    request.body.rewind  # in case someone already read it
    data = JSON.parse request.body.read
    compiled = data['code']
    if compiled.include? '%25'
      refined = compiled.to_s.gsub!('%25', '%')
      output = HTML2Slim.convert!(refined, :erb)
      compiled = Slim::Template.new('STDIN') { output.to_s }.render
    else
      output = HTML2Slim.convert!(compiled, :html)
    end
    { html: output.to_s, compiled: compiled }.to_json
  rescue => e
    { errorMsg: escape_html(e.inspect.to_s) }.to_json
  end
end

post '/convert-slim' do
  begin
    request.body.rewind  # in case someone already read it
    data = JSON.parse request.body.read
    output = Slim::Template.new('STDIN') { data['code'] }.render
    { html: output.to_s }.to_json
  rescue => e
    { errorMsg: escape_html(e.inspect.to_s) }.to_json
  end
end

get '/test' do
  begin
    output = Slim::Template.new("test.slim").render
  rescue => e
    { errorMsg: escape_html(e.inspect.to_s) }.to_json
  end
end

get '/stylesheets/:name.css' do
 content_type 'text/css', :charset => 'utf-8'
 scss(:"stylesheets/#{params[:name]}")
end