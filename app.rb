require 'bundler/setup'
require 'rubygems'
require 'sass'
require 'compass'
require 'sinatra'
require 'slim'
require 'json'
require 'slim/erb_converter'
require 'html2slim'

Slim::Engine.default_options[:pretty] = true


configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = 'scss'
    config.output_style = :compact
    line_comments = false
  end

  set :haml, { :format => :html5 }
  set :sass, Compass.sass_engine_options
  set :scss, Compass.sass_engine_options
end

get '/' do
  Slim::Template.new("index.slim", {}).render(self)
end

post '/convert2slim' do
  request.body.rewind  # in case someone already read it
  data = JSON.parse request.body.read
  output_html = HTML2Slim.convert!(data['code'], :html)
  { render: output_html.to_s }.to_json
end

post '/convert2html' do
  request.body.rewind  # in case someone already read it
  data = JSON.parse request.body.read
  to_erb = Slim::ERBConverter.new.call(data['code'])
  output_html = ERB.new(to_erb).result
  { render: output_html.to_s }.to_json
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  scss :"scss/#{params[:name]}"
end