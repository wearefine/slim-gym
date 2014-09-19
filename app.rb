require 'bundler/setup'
require 'rubygems'
require 'sinatra'
require 'slim'
require 'nokogiri'
require 'json'
require 'slim/erb_converter'


Slim::Engine.default_options[:pretty] = true

get '/' do
  Slim::Template.new("index.slim", {}).render(self)
end

post '/convert' do
  request.body.rewind  # in case someone already read it
  data = JSON.parse request.body.read
  hel = Slim::ERBConverter.new.call(data['code'])
  output_html = ERB.new(hel).result
  { render: output_html.to_s }.to_json
end

get '/test' do
  contents = File.read('sample.json')
  data = JSON.parse(contents)
  sample = %q{
h1 words here
section
  h2 section title
}
  data
end