require 'bundler/setup'
require 'rubygems'
require 'sinatra'
require 'slim'
require 'nokogiri'


Slim::Engine.default_options[:pretty] = true

get '/' do
  "Hello World"
  slim_temp = "h1 Hello Worr\nh2 This"
  value = %x[slimrb -s -p -c << #{slim_temp}]
  doc = Nokogiri::XML(%Q{<div>#{value}</div>}, &:noblanks)
  doc.children.first.children.each { |c| puts c.to_xhtml }
  logger.info doc.children
end