module Jekyll
  module AddNonBreakingSpacesFilter
    def add_non_breaking_spaces(input)
      text = input

      text = text.gsub(/ i /, ' i&nbsp;')
      text = text.gsub(/ w /, ' w&nbsp;')
      text = text.gsub(/ z /, ' z&nbsp;')
      text = text.gsub(/ u /, ' u&nbsp;')
      text = text.gsub(/ o /, ' o&nbsp;')
      text = text.gsub(/ a /, ' a&nbsp;')
      text = text.gsub(/ - /, '&nbsp;-&nbsp;')
      text = text.gsub(/ — /, '&nbsp;—&nbsp;')

      text
    end
  end
end

Liquid::Template::register_filter(Jekyll::AddNonBreakingSpacesFilter)
