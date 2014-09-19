#!/bin/bash
code=$1
compiled=$(/Users/Tim/.rvm/gems/ruby-2.1.3@slim_playground/bin/slimrb -c <<< "$code")
ruby -e "$compiled; require 'nokogiri'; doc = Nokogiri::XML(%Q{<div>#{_buf}</div>}, &:noblanks); doc.children.first.children.each { |c| puts c.to_xhtml }"
